-- =============================================
-- SCRIPT 7: FUNÇÕES PARA API E INTEGRAÇÃO
-- =============================================

-- Função para criar documento com validações
CREATE OR REPLACE FUNCTION create_document(
    p_title TEXT,
    p_document_type_id UUID,
    p_department_id UUID,
    p_category_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_tags TEXT[] DEFAULT '{}',
    p_file_name TEXT DEFAULT NULL,
    p_file_type TEXT DEFAULT NULL,
    p_file_size BIGINT DEFAULT NULL,
    p_file_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_document_id UUID;
    v_document_number TEXT;
    v_type_prefix TEXT;
    v_workflow_id UUID;
BEGIN
    -- Verificar se o usuário está autenticado
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Usuário não autenticado';
    END IF;

    -- Verificar permissões
    IF NOT has_permission('write') THEN
        RAISE EXCEPTION 'Usuário não tem permissão para criar documentos';
    END IF;

    -- Buscar prefixo do tipo de documento
    SELECT prefix INTO v_type_prefix
    FROM document_types
    WHERE id = p_document_type_id AND status = 'active';

    IF v_type_prefix IS NULL THEN
        RAISE EXCEPTION 'Tipo de documento inválido ou inativo';
    END IF;

    -- Gerar número do documento
    v_document_number := generate_document_number(v_type_prefix);

    -- Buscar workflow padrão para o tipo de documento
    SELECT id INTO v_workflow_id
    FROM approval_workflows
    WHERE p_document_type_id::TEXT = ANY(document_types)
    AND status = 'active'
    LIMIT 1;

    -- Criar o documento
    INSERT INTO documents (
        number, title, author_id, department_id, category_id,
        document_type_id, workflow_id, description, tags,
        file_name, file_type, file_size, file_url
    ) VALUES (
        v_document_number, p_title, auth.uid(), p_department_id, p_category_id,
        p_document_type_id, v_workflow_id, p_description, p_tags,
        p_file_name, p_file_type, p_file_size, p_file_url
    ) RETURNING id INTO v_document_id;

    RETURN v_document_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para enviar documento para aprovação
CREATE OR REPLACE FUNCTION send_document_for_approval(p_document_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_workflow_id UUID;
    v_workflow_steps JSONB;
    v_step JSONB;
    v_step_number INTEGER := 1;
BEGIN
    -- Verificar se o documento existe e pertence ao usuário
    SELECT workflow_id INTO v_workflow_id
    FROM documents
    WHERE id = p_document_id
    AND author_id = auth.uid()
    AND status = 'draft';

    IF v_workflow_id IS NULL THEN
        RAISE EXCEPTION 'Documento não encontrado ou não pode ser enviado para aprovação';
    END IF;

    -- Buscar etapas do workflow
    SELECT steps INTO v_workflow_steps
    FROM approval_workflows
    WHERE id = v_workflow_id;

    -- Criar aprovações para cada etapa
    FOR v_step IN SELECT * FROM jsonb_array_elements(v_workflow_steps)
    LOOP
        -- Inserir aprovação para cada usuário da etapa
        INSERT INTO document_approvals (
            document_id, approver_id, step_number, step_name, status
        )
        SELECT
            p_document_id,
            p.id,
            v_step_number,
            v_step->>'name',
            'pending'
        FROM profiles p
        WHERE p.full_name = ANY(
            SELECT jsonb_array_elements_text(v_step->'users')
        );

        v_step_number := v_step_number + 1;
    END LOOP;

    -- Atualizar status do documento
    UPDATE documents
    SET
        status = 'pending',
        current_approval_step = 1,
        total_approval_steps = jsonb_array_length(v_workflow_steps)
    WHERE id = p_document_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para aprovar/rejeitar documento
CREATE OR REPLACE FUNCTION approve_document(
    p_document_id UUID,
    p_approved BOOLEAN,
    p_comment TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_approval_id UUID;
    v_step_number INTEGER;
    v_total_steps INTEGER;
    v_current_step INTEGER;
    v_pending_approvals INTEGER;
BEGIN
    -- Verificar se existe aprovação pendente para este usuário
    SELECT id, step_number INTO v_approval_id, v_step_number
    FROM document_approvals
    WHERE document_id = p_document_id
    AND approver_id = auth.uid()
    AND status = 'pending';

    IF v_approval_id IS NULL THEN
        RAISE EXCEPTION 'Nenhuma aprovação pendente encontrada para este usuário';
    END IF;

    -- Atualizar a aprovação
    UPDATE document_approvals
    SET
        status = CASE WHEN p_approved THEN 'approved' ELSE 'rejected' END,
        comment = p_comment,
        approved_at = NOW()
    WHERE id = v_approval_id;

    -- Se foi rejeitado, atualizar documento
    IF NOT p_approved THEN
        UPDATE documents
        SET status = 'rejected'
        WHERE id = p_document_id;
        RETURN TRUE;
    END IF;

    -- Verificar se todas as aprovações da etapa atual foram concluídas
    SELECT current_approval_step, total_approval_steps
    INTO v_current_step, v_total_steps
    FROM documents
    WHERE id = p_document_id;

    SELECT COUNT(*) INTO v_pending_approvals
    FROM document_approvals
    WHERE document_id = p_document_id
    AND step_number = v_current_step
    AND status = 'pending';

    -- Se não há mais aprovações pendentes na etapa atual
    IF v_pending_approvals = 0 THEN
        -- Se é a última etapa, aprovar documento
        IF v_current_step >= v_total_steps THEN
            UPDATE documents
            SET
                status = 'approved',
                approved_at = NOW()
            WHERE id = p_document_id;
        ELSE
            -- Avançar para próxima etapa
            UPDATE documents
            SET current_approval_step = current_approval_step + 1
            WHERE id = p_document_id;
        END IF;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criar nova versão de documento
CREATE OR REPLACE FUNCTION create_document_version(
    p_document_id UUID,
    p_title TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_changes_summary TEXT DEFAULT NULL,
    p_file_name TEXT DEFAULT NULL,
    p_file_type TEXT DEFAULT NULL,
    p_file_size BIGINT DEFAULT NULL,
    p_file_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_version_id UUID;
    v_current_version TEXT;
    v_new_version TEXT;
    v_major_version INTEGER;
BEGIN
    -- Verificar se o documento existe e o usuário tem permissão
    SELECT version INTO v_current_version
    FROM documents
    WHERE id = p_document_id
    AND (author_id = auth.uid() OR is_admin());

    IF v_current_version IS NULL THEN
        RAISE EXCEPTION 'Documento não encontrado ou sem permissão';
    END IF;

    -- Calcular nova versão (incrementar versão maior)
    v_major_version := CAST(SPLIT_PART(v_current_version, '.', 1) AS INTEGER) + 1;
    v_new_version := v_major_version || '.0';

    -- Criar registro de versão
    INSERT INTO document_versions (
        document_id, version, author_id, title, description,
        file_name, file_type, file_size, file_url, changes_summary
    ) VALUES (
        p_document_id, v_new_version, auth.uid(),
        COALESCE(p_title, (SELECT title FROM documents WHERE id = p_document_id)),
        p_description, p_file_name, p_file_type, p_file_size, p_file_url, p_changes_summary
    ) RETURNING id INTO v_version_id;

    -- Atualizar documento principal
    UPDATE documents
    SET
        version = v_new_version,
        title = COALESCE(p_title, title),
        description = COALESCE(p_description, description),
        file_name = COALESCE(p_file_name, file_name),
        file_type = COALESCE(p_file_type, file_type),
        file_size = COALESCE(p_file_size, file_size),
        file_url = COALESCE(p_file_url, file_url),
        status = 'draft',
        current_approval_step = 0,
        approved_count = 0,
        approved_at = NULL
    WHERE id = p_document_id;

    RETURN v_version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para adicionar documento aos favoritos
CREATE OR REPLACE FUNCTION toggle_document_favorite(p_document_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- Verificar se já está nos favoritos
    SELECT EXISTS(
        SELECT 1 FROM document_favorites
        WHERE document_id = p_document_id AND user_id = auth.uid()
    ) INTO v_exists;

    IF v_exists THEN
        -- Remover dos favoritos
        DELETE FROM document_favorites
        WHERE document_id = p_document_id AND user_id = auth.uid();
        RETURN FALSE;
    ELSE
        -- Adicionar aos favoritos
        INSERT INTO document_favorites (document_id, user_id)
        VALUES (p_document_id, auth.uid());
        RETURN TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para compartilhar documento
CREATE OR REPLACE FUNCTION share_document(
    p_document_id UUID,
    p_shared_with UUID DEFAULT NULL,
    p_shared_email TEXT DEFAULT NULL,
    p_permission TEXT DEFAULT 'read',
    p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_share_id UUID;
BEGIN
    -- Verificar se o usuário é dono do documento
    IF NOT EXISTS(
        SELECT 1 FROM documents
        WHERE id = p_document_id AND author_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Apenas o autor pode compartilhar o documento';
    END IF;

    -- Verificar se pelo menos um destinatário foi informado
    IF p_shared_with IS NULL AND p_shared_email IS NULL THEN
        RAISE EXCEPTION 'Informe um usuário ou email para compartilhar';
    END IF;

    -- Criar compartilhamento
    INSERT INTO document_shares (
        document_id, shared_by, shared_with, shared_email,
        permission, expires_at
    ) VALUES (
        p_document_id, auth.uid(), p_shared_with, p_shared_email,
        p_permission, p_expires_at
    ) RETURNING id INTO v_share_id;

    RETURN v_share_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
