-- Indexes for performance optimization

-- Users Table
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_department_id ON users (department_id);

-- Departments Table
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments (name);

-- Categories Table
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories (name);

-- DocumentTypes Table
CREATE INDEX IF NOT EXISTS idx_document_types_name ON document_types (name);

-- ApprovalWorkflows Table
CREATE INDEX IF NOT EXISTS idx_approval_workflows_name ON approval_workflows (name);
CREATE INDEX IF NOT EXISTS idx_approval_workflows_status ON approval_workflows (status);

-- WorkflowSteps Table
CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow_id ON workflow_steps (workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_approver_user_id ON workflow_steps (approver_user_id);

-- Documents Table
CREATE INDEX IF NOT EXISTS idx_documents_title ON documents (title);
CREATE INDEX IF NOT EXISTS idx_documents_document_number ON documents (document_number);
CREATE INDEX IF NOT EXISTS idx_documents_author_id ON documents (author_id);
CREATE INDEX IF NOT EXISTS idx_documents_category_id ON documents (category_id);
CREATE INDEX IF NOT EXISTS idx_documents_department_id ON documents (department_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type_id ON documents (document_type_id);
CREATE INDEX IF NOT EXISTS idx_documents_current_status ON documents (current_status);
CREATE INDEX IF NOT EXISTS idx_documents_current_workflow_id ON documents (current_workflow_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_published_at ON documents (published_at DESC);

-- DocumentVersions Table
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON document_versions (document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_created_by ON document_versions (created_by);

-- ApprovalRequests Table
CREATE INDEX IF NOT EXISTS idx_approval_requests_document_id ON approval_requests (document_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_approver_id ON approval_requests (approver_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests (status);
CREATE INDEX IF NOT EXISTS idx_approval_requests_workflow_step_id ON approval_requests (workflow_step_id);

-- Comments Table
CREATE INDEX IF NOT EXISTS idx_comments_document_id ON comments (document_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments (user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON comments (parent_comment_id);

-- AuditLog Table
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_document_id ON audit_log (document_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log (action);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log (timestamp DESC);

-- DocumentShares Table
CREATE INDEX IF NOT EXISTS idx_document_shares_document_id ON document_shares (document_id);
CREATE INDEX IF NOT EXISTS idx_document_shares_shared_with_user_id ON document_shares (shared_with_user_id);

-- DocumentFavorites Table
CREATE INDEX IF NOT EXISTS idx_document_favorites_user_id ON document_favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_document_favorites_document_id ON document_favorites (document_id);
