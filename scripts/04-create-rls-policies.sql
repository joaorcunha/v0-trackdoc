-- =============================================
-- SCRIPT 4: POLÍTICAS DE SEGURANÇA (RLS)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;

-- Função helper para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função helper para verificar permissões do usuário
CREATE OR REPLACE FUNCTION has_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND (permissions ? permission_name OR role = 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLÍTICAS PARA PROFILES
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage all profiles" ON profiles
    FOR ALL USING (is_admin());

-- POLÍTICAS PARA DEPARTMENTS
CREATE POLICY "Everyone can view active departments" ON departments
    FOR SELECT USING (status = 'active' OR is_admin());

CREATE POLICY "Admins can manage departments" ON departments
    FOR ALL USING (is_admin());

-- POLÍTICAS PARA CATEGORIES
CREATE POLICY "Everyone can view active categories" ON categories
    FOR SELECT USING (status = 'active' OR is_admin());

CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (is_admin());

-- POLÍTICAS PARA DOCUMENT_TYPES
CREATE POLICY "Everyone can view active document types" ON document_types
    FOR SELECT USING (status = 'active' OR is_admin());

CREATE POLICY "Admins can manage document types" ON document_types
    FOR ALL USING (is_admin());

-- POLÍTICAS PARA APPROVAL_WORKFLOWS
CREATE POLICY "Everyone can view active workflows" ON approval_workflows
    FOR SELECT USING (status = 'active' OR is_admin());

CREATE POLICY "Admins can manage workflows" ON approval_workflows
    FOR ALL USING (is_admin());

-- POLÍTICAS PARA DOCUMENTS
CREATE POLICY "Users can view documents they have access to" ON documents
    FOR SELECT USING (
        -- Autor pode ver seus próprios documentos
        author_id = auth.uid() OR
        -- Admin pode ver todos
        is_admin() OR
        -- Usuários do mesmo departamento podem ver documentos aprovados
        (status = 'approved' AND department_id IN (
            SELECT department_id FROM profiles WHERE id = auth.uid()
        )) OR
        -- Aprovadores podem ver documentos pendentes que precisam aprovar
        (status = 'pending' AND id IN (
            SELECT document_id FROM document_approvals 
            WHERE approver_id = auth.uid() AND status = 'pending'
        )) OR
        -- Documentos compartilhados
        id IN (
            SELECT document_id FROM document_shares 
            WHERE shared_with = auth.uid() OR shared_email = (
                SELECT email FROM profiles WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create documents" ON documents
    FOR INSERT WITH CHECK (
        auth.uid() = author_id AND has_permission('write')
    );

CREATE POLICY "Authors can update their draft documents" ON documents
    FOR UPDATE USING (
        author_id = auth.uid() AND 
        status = 'draft' AND 
        has_permission('write')
    );

CREATE POLICY "Admins can manage all documents" ON documents
    FOR ALL USING (is_admin());

-- POLÍTICAS PARA DOCUMENT_VERSIONS
CREATE POLICY "Users can view versions of accessible documents" ON document_versions
    FOR SELECT USING (
        document_id IN (
            SELECT id FROM documents WHERE 
            author_id = auth.uid() OR is_admin() OR status = 'approved'
        )
    );

CREATE POLICY "Authors can create versions" ON document_versions
    FOR INSERT WITH CHECK (
        author_id = auth.uid() AND has_permission('write')
    );

-- POLÍTICAS PARA DOCUMENT_APPROVALS
CREATE POLICY "Approvers can view their approvals" ON document_approvals
    FOR SELECT USING (
        approver_id = auth.uid() OR is_admin() OR
        document_id IN (SELECT id FROM documents WHERE author_id = auth.uid())
    );

CREATE POLICY "Approvers can update their approvals" ON document_approvals
    FOR UPDATE USING (
        approver_id = auth.uid() AND status = 'pending'
    );

CREATE POLICY "System can create approvals" ON document_approvals
    FOR INSERT WITH CHECK (true);

-- POLÍTICAS PARA AUDIT_LOGS
CREATE POLICY "Users can view audit logs of their documents" ON audit_logs
    FOR SELECT USING (
        user_id = auth.uid() OR is_admin() OR
        document_id IN (SELECT id FROM documents WHERE author_id = auth.uid())
    );

CREATE POLICY "System can create audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- POLÍTICAS PARA DOCUMENT_COMMENTS
CREATE POLICY "Users can view comments on accessible documents" ON document_comments
    FOR SELECT USING (
        document_id IN (
            SELECT id FROM documents WHERE 
            author_id = auth.uid() OR is_admin() OR status = 'approved'
        )
    );

CREATE POLICY "Users can create comments" ON document_comments
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND has_permission('write')
    );

CREATE POLICY "Users can update their own comments" ON document_comments
    FOR UPDATE USING (user_id = auth.uid());

-- POLÍTICAS PARA DOCUMENT_FAVORITES
CREATE POLICY "Users can manage their own favorites" ON document_favorites
    FOR ALL USING (user_id = auth.uid());

-- POLÍTICAS PARA DOCUMENT_SHARES
CREATE POLICY "Users can view shares they created or received" ON document_shares
    FOR SELECT USING (
        shared_by = auth.uid() OR 
        shared_with = auth.uid() OR
        shared_email = (SELECT email FROM profiles WHERE id = auth.uid()) OR
        is_admin()
    );

CREATE POLICY "Users can create shares for their documents" ON document_shares
    FOR INSERT WITH CHECK (
        shared_by = auth.uid() AND
        document_id IN (SELECT id FROM documents WHERE author_id = auth.uid())
    );

CREATE POLICY "Users can update their own shares" ON document_shares
    FOR UPDATE USING (shared_by = auth.uid());

CREATE POLICY "Users can delete their own shares" ON document_shares
    FOR DELETE USING (shared_by = auth.uid());
