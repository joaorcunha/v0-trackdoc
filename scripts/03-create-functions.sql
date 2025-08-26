-- =============================================
-- SCRIPT 3: FUNÇÕES E TRIGGERS
-- =============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_types_updated_at BEFORE UPDATE ON document_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_comments_updated_at BEFORE UPDATE ON document_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar número de documento
CREATE OR REPLACE FUNCTION generate_document_number(doc_type_prefix TEXT)
RETURNS TEXT AS $$
DECLARE
    current_year TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
    next_sequence INTEGER;
    document_number TEXT;
BEGIN
    -- Buscar o próximo número sequencial para o tipo e ano
    SELECT COALESCE(MAX(
        CAST(SPLIT_PART(number, '-', 3) AS INTEGER)
    ), 0) + 1
    INTO next_sequence
    FROM documents 
    WHERE number LIKE doc_type_prefix || '-' || current_year || '-%';
    
    -- Formatar o número com zeros à esquerda
    document_number := doc_type_prefix || '-' || current_year || '-' || LPAD(next_sequence::TEXT, 3, '0');
    
    RETURN document_number;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar contadores
CREATE OR REPLACE FUNCTION update_counters()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar contador de documentos por departamento
    IF TG_OP = 'INSERT' THEN
        UPDATE departments 
        SET documents_count = documents_count + 1 
        WHERE id = NEW.department_id;
        
        UPDATE categories 
        SET documents_count = documents_count + 1 
        WHERE id = NEW.category_id;
        
        UPDATE document_types 
        SET documents_count = documents_count + 1 
        WHERE id = NEW.document_type_id;
        
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE departments 
        SET documents_count = documents_count - 1 
        WHERE id = OLD.department_id;
        
        UPDATE categories 
        SET documents_count = documents_count - 1 
        WHERE id = OLD.category_id;
        
        UPDATE document_types 
        SET documents_count = documents_count - 1 
        WHERE id = OLD.document_type_id;
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Se mudou de departamento
        IF OLD.department_id != NEW.department_id THEN
            UPDATE departments SET documents_count = documents_count - 1 WHERE id = OLD.department_id;
            UPDATE departments SET documents_count = documents_count + 1 WHERE id = NEW.department_id;
        END IF;
        
        -- Se mudou de categoria
        IF OLD.category_id != NEW.category_id THEN
            UPDATE categories SET documents_count = documents_count - 1 WHERE id = OLD.category_id;
            UPDATE categories SET documents_count = documents_count + 1 WHERE id = NEW.category_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contadores
CREATE TRIGGER update_document_counters
    AFTER INSERT OR UPDATE OR DELETE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_counters();

-- Função para log de auditoria automático
CREATE OR REPLACE FUNCTION log_document_changes()
RETURNS TRIGGER AS $$
DECLARE
    action_type TEXT;
    user_id_val UUID;
BEGIN
    -- Determinar o tipo de ação
    IF TG_OP = 'INSERT' THEN
        action_type := 'created';
        user_id_val := NEW.author_id;
    ELSIF TG_OP = 'UPDATE' THEN
        action_type := 'updated';
        user_id_val := NEW.author_id;
        
        -- Ações específicas baseadas em mudanças de status
        IF OLD.status != NEW.status THEN
            CASE NEW.status
                WHEN 'pending' THEN action_type := 'sent_for_approval';
                WHEN 'approved' THEN action_type := 'approved';
                WHEN 'rejected' THEN action_type := 'rejected';
            END CASE;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        action_type := 'deleted';
        user_id_val := OLD.author_id;
    END IF;
    
    -- Inserir log de auditoria
    INSERT INTO audit_logs (document_id, user_id, action, details, metadata)
    VALUES (
        COALESCE(NEW.id, OLD.id),
        user_id_val,
        action_type,
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'Documento criado: ' || COALESCE(NEW.title, '')
            WHEN TG_OP = 'UPDATE' THEN 'Documento atualizado: ' || COALESCE(NEW.title, '')
            WHEN TG_OP = 'DELETE' THEN 'Documento excluído: ' || COALESCE(OLD.title, '')
        END,
        jsonb_build_object(
            'old_status', CASE WHEN TG_OP != 'INSERT' THEN OLD.status END,
            'new_status', CASE WHEN TG_OP != 'DELETE' THEN NEW.status END,
            'version', CASE WHEN TG_OP != 'DELETE' THEN NEW.version END
        )
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para auditoria automática
CREATE TRIGGER log_document_audit
    AFTER INSERT OR UPDATE OR DELETE ON documents
    FOR EACH ROW EXECUTE FUNCTION log_document_changes();

-- Função para busca de documentos
CREATE OR REPLACE FUNCTION search_documents(
    search_term TEXT DEFAULT '',
    status_filter TEXT DEFAULT 'all',
    department_filter UUID DEFAULT NULL,
    category_filter UUID DEFAULT NULL,
    user_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    number VARCHAR(50),
    title VARCHAR(500),
    author_name VARCHAR(255),
    version VARCHAR(10),
    status VARCHAR(20),
    department_name VARCHAR(255),
    category_name VARCHAR(255),
    file_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.number,
        d.title,
        p.full_name as author_name,
        d.version,
        d.status,
        dept.name as department_name,
        cat.name as category_name,
        d.file_name,
        d.created_at,
        d.updated_at
    FROM documents d
    LEFT JOIN profiles p ON d.author_id = p.id
    LEFT JOIN departments dept ON d.department_id = dept.id
    LEFT JOIN categories cat ON d.category_id = cat.id
    WHERE 
        (search_term = '' OR 
         d.title ILIKE '%' || search_term || '%' OR 
         d.number ILIKE '%' || search_term || '%' OR
         p.full_name ILIKE '%' || search_term || '%')
        AND (status_filter = 'all' OR d.status = status_filter)
        AND (department_filter IS NULL OR d.department_id = department_filter)
        AND (category_filter IS NULL OR d.category_id = category_filter)
    ORDER BY d.created_at DESC;
END;
$$ LANGUAGE plpgsql;
