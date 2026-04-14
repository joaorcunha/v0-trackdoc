-- Enable Row Level Security on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for 'users' table
-- Admins can see and manage all users
CREATE POLICY users_admin_all ON users
FOR ALL USING (current_user_is_admin());
-- Users can see their own profile
CREATE POLICY users_view_own ON users
FOR SELECT USING (auth.uid() = id);

-- Policies for 'departments' table
-- Admins can manage all departments
CREATE POLICY departments_admin_all ON departments
FOR ALL USING (current_user_is_admin());
-- All authenticated users can view departments
CREATE POLICY departments_view_all ON departments
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Policies for 'categories' table
-- Admins can manage all categories
CREATE POLICY categories_admin_all ON categories
FOR ALL USING (current_user_is_admin());
-- All authenticated users can view categories
CREATE POLICY categories_view_all ON categories
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Policies for 'document_types' table
-- Admins can manage all document types
CREATE POLICY document_types_admin_all ON document_types
FOR ALL USING (current_user_is_admin());
-- All authenticated users can view document types
CREATE POLICY document_types_view_all ON document_types
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Policies for 'approval_workflows' table
-- Admins can manage all workflows
CREATE POLICY approval_workflows_admin_all ON approval_workflows
FOR ALL USING (current_user_is_admin());
-- All authenticated users can view active workflows
CREATE POLICY approval_workflows_view_active ON approval_workflows
FOR SELECT USING (auth.uid() IS NOT NULL AND status = 'active');

-- Policies for 'workflow_steps' table
-- Admins can manage all workflow steps
CREATE POLICY workflow_steps_admin_all ON workflow_steps
FOR ALL USING (current_user_is_admin());
-- All authenticated users can view workflow steps related to active workflows
CREATE POLICY workflow_steps_view_all ON workflow_steps
FOR SELECT USING (auth.uid() IS NOT NULL AND workflow_id IN (SELECT id FROM approval_workflows WHERE status = 'active'));

-- Policies for 'documents' table
-- Admins can manage all documents
CREATE POLICY documents_admin_all ON documents
FOR ALL USING (current_user_is_admin());
-- Editors can create and edit documents they own or are assigned to
CREATE POLICY documents_editor_manage ON documents
FOR ALL USING (current_user_is_editor() AND (author_id = auth.uid() OR current_workflow_step_id IN (SELECT id FROM workflow_steps WHERE approver_user_id = auth.uid())));
-- Viewers can view published documents or documents shared with them
CREATE POLICY documents_viewer_view ON documents
FOR SELECT USING (
    current_status = 'published'
    OR id IN (SELECT document_id FROM document_shares WHERE shared_with_user_id = auth.uid())
    OR author_id = auth.uid() -- Author can always view their own documents
);

-- Policies for 'document_versions' table
-- Admins can manage all document versions
CREATE POLICY document_versions_admin_all ON document_versions
FOR ALL USING (current_user_is_admin());
-- Users can view versions of documents they have access to
CREATE POLICY document_versions_view ON document_versions
FOR SELECT USING (document_id IN (SELECT id FROM documents WHERE current_user_can_view_document(id)));

-- Policies for 'approval_requests' table
-- Admins can manage all approval requests
CREATE POLICY approval_requests_admin_all ON approval_requests
FOR ALL USING (current_user_is_admin());
-- Approvers can view and update requests assigned to them
CREATE POLICY approval_requests_approver_manage ON approval_requests
FOR ALL USING (approver_id = auth.uid());
-- Document authors can view requests for their documents
CREATE POLICY approval_requests_author_view ON approval_requests
FOR SELECT USING (document_id IN (SELECT id FROM documents WHERE author_id = auth.uid()));

-- Policies for 'comments' table
-- Admins can manage all comments
CREATE POLICY comments_admin_all ON comments
FOR ALL USING (current_user_is_admin());
-- Users can create comments on documents they can view
CREATE POLICY comments_create ON comments
FOR INSERT WITH CHECK (document_id IN (SELECT id FROM documents WHERE current_user_can_view_document(id)));
-- Users can view comments on documents they can view
CREATE POLICY comments_view ON comments
FOR SELECT USING (document_id IN (SELECT id FROM documents WHERE current_user_can_view_document(id)));
-- Users can update/delete their own comments
CREATE POLICY comments_manage_own ON comments
FOR ALL USING (user_id = auth.uid());

-- Policies for 'audit_log' table
-- Only Admins can view audit logs
CREATE POLICY audit_log_admin_view ON audit_log
FOR SELECT USING (current_user_is_admin());

-- Policies for 'document_shares' table
-- Admins can manage all shares
CREATE POLICY document_shares_admin_all ON document_shares
FOR ALL USING (current_user_is_admin());
-- Users can create shares for documents they own
CREATE POLICY document_shares_create_own ON document_shares
FOR INSERT WITH CHECK (document_id IN (SELECT id FROM documents WHERE author_id = auth.uid()));
-- Users can view shares they are part of or created
CREATE POLICY document_shares_view ON document_shares
FOR SELECT USING (shared_by = auth.uid() OR shared_with_user_id = auth.uid());
-- Users can delete shares they created
CREATE POLICY document_shares_delete_own ON document_shares
FOR DELETE USING (shared_by = auth.uid());

-- Policies for 'document_favorites' table
-- Admins can manage all favorites
CREATE POLICY document_favorites_admin_all ON document_favorites
FOR ALL USING (current_user_is_admin());
-- Users can manage their own favorites
CREATE POLICY document_favorites_manage_own ON document_favorites
FOR ALL USING (user_id = auth.uid());
