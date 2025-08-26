-- =============================================
-- SCRIPT 2: CRIAÇÃO DE ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices para tabela departments
CREATE INDEX idx_departments_status ON departments(status);
CREATE INDEX idx_departments_name ON departments(name);

-- Índices para tabela categories
CREATE INDEX idx_categories_status ON categories(status);
CREATE INDEX idx_categories_name ON categories(name);

-- Índices para tabela document_types
CREATE INDEX idx_document_types_status ON document_types(status);
CREATE INDEX idx_document_types_prefix ON document_types(prefix);

-- Índices para tabela profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_department ON profiles(department_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);

-- Índices para tabela documents (principais)
CREATE INDEX idx_documents_number ON documents(number);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_author ON documents(author_id);
CREATE INDEX idx_documents_department ON documents(department_id);
CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_type ON documents(document_type_id);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX idx_documents_title_search ON documents USING gin(to_tsvector('portuguese', title));
CREATE INDEX idx_documents_tags ON documents USING gin(tags);

-- Índices para tabela document_versions
CREATE INDEX idx_document_versions_document ON document_versions(document_id);
CREATE INDEX idx_document_versions_author ON document_versions(author_id);
CREATE INDEX idx_document_versions_created ON document_versions(created_at DESC);

-- Índices para tabela document_approvals
CREATE INDEX idx_document_approvals_document ON document_approvals(document_id);
CREATE INDEX idx_document_approvals_approver ON document_approvals(approver_id);
CREATE INDEX idx_document_approvals_status ON document_approvals(status);
CREATE INDEX idx_document_approvals_step ON document_approvals(step_number);

-- Índices para tabela audit_logs
CREATE INDEX idx_audit_logs_document ON audit_logs(document_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- Índices para tabela document_comments
CREATE INDEX idx_document_comments_document ON document_comments(document_id);
CREATE INDEX idx_document_comments_user ON document_comments(user_id);
CREATE INDEX idx_document_comments_parent ON document_comments(parent_id);

-- Índices para tabela document_favorites
CREATE INDEX idx_document_favorites_user ON document_favorites(user_id);
CREATE INDEX idx_document_favorites_document ON document_favorites(document_id);

-- Índices para tabela document_shares
CREATE INDEX idx_document_shares_document ON document_shares(document_id);
CREATE INDEX idx_document_shares_shared_by ON document_shares(shared_by);
CREATE INDEX idx_document_shares_shared_with ON document_shares(shared_with);
CREATE INDEX idx_document_shares_email ON document_shares(shared_email);
