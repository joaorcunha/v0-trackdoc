-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'viewer' NOT NULL, -- e.g., 'admin', 'editor', 'viewer'
    department_id UUID REFERENCES departments(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create DocumentTypes Table
CREATE TABLE IF NOT EXISTS document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ApprovalWorkflows Table
CREATE TABLE IF NOT EXISTS approval_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'inactive'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create WorkflowSteps Table (for complex workflows)
CREATE TABLE IF NOT EXISTS workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES approval_workflows(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    approver_role TEXT, -- e.g., 'manager', 'director', 'specific_user'
    approver_user_id UUID REFERENCES users(id), -- For specific user approval
    required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTIMPTZ DEFAULT NOW(),
    UNIQUE (workflow_id, step_order)
);

-- Create Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    document_number TEXT UNIQUE NOT NULL,
    version TEXT DEFAULT '1.0' NOT NULL,
    content TEXT, -- Or a path to a file storage
    file_url TEXT, -- URL to the actual document file
    author_id UUID REFERENCES users(id),
    category_id UUID REFERENCES categories(id),
    department_id UUID REFERENCES departments(id),
    document_type_id UUID REFERENCES document_types(id),
    current_status TEXT DEFAULT 'draft' NOT NULL, -- 'draft', 'pending', 'approved', 'rejected', 'published'
    current_workflow_id UUID REFERENCES approval_workflows(id),
    current_workflow_step_id UUID REFERENCES workflow_steps(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Create DocumentVersions Table
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    UNIQUE (document_id, version_number)
);

-- Create ApprovalRequests Table
CREATE TABLE IF NOT EXISTS approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES approval_workflows(id),
    workflow_step_id UUID REFERENCES workflow_steps(id),
    approver_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected'
    comments TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ
);

-- Create Comments Table (for document discussions)
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    parent_comment_id UUID REFERENCES comments(id), -- For threaded comments
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AuditLog Table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    document_id UUID REFERENCES documents(id),
    action TEXT NOT NULL, -- e.g., 'document_created', 'document_edited', 'user_login', 'document_approved'
    details JSONB, -- Store additional details about the action
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create DocumentShares Table
CREATE TABLE IF NOT EXISTS document_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES users(id),
    shared_with_user_id UUID REFERENCES users(id),
    shared_with_email TEXT, -- For external shares
    permission_level TEXT NOT NULL, -- 'view', 'comment'
    shared_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Create DocumentFavorites Table
CREATE TABLE IF NOT EXISTS document_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    favorited_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, document_id) -- A user can favorite a document only once
);
