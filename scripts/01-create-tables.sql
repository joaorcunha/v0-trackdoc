-- =============================================
-- SCRIPT 1: CRIAÇÃO DE TABELAS
-- =============================================

-- Tabela de Perfis (Usuários)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'user', -- 'admin', 'manager', 'user'
    status TEXT DEFAULT 'active', -- 'active', 'inactive', 'pending'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Departamentos
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    short_name TEXT NOT NULL UNIQUE,
    description TEXT,
    manager_id UUID REFERENCES profiles(id), -- Gerente do departamento
    color TEXT, -- Cor para identificação visual
    status TEXT DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Tipos de Documento
CREATE TABLE IF NOT EXISTS document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    prefix TEXT NOT NULL UNIQUE, -- Ex: "POL" para Política, "PROC" para Procedimento
    color TEXT, -- Cor para identificação visual
    required_fields TEXT[] DEFAULT '{}', -- Campos obrigatórios (ex: 'title', 'author', 'sector')
    approval_required BOOLEAN DEFAULT FALSE,
    retention_period INTEGER DEFAULT 24, -- Período de retenção em meses
    status TEXT DEFAULT 'active', -- 'active', 'inactive'
    template_url TEXT, -- URL para um template de documento (opcional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Categorias de Documento
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT, -- Cor para identificação visual
    status TEXT DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Documentos
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number TEXT UNIQUE, -- Número gerado automaticamente (ex: POL-2023-001)
    title TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id),
    department_id UUID REFERENCES departments(id),
    category_id UUID REFERENCES categories(id),
    document_type_id UUID REFERENCES document_types(id),
    workflow_id UUID, -- Referência ao workflow de aprovação (se houver)
    version TEXT DEFAULT '1.0',
    status TEXT DEFAULT 'draft', -- 'draft', 'pending', 'approved', 'rejected', 'archived'
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    file_name TEXT,
    file_type TEXT,
    file_size BIGINT,
    file_url TEXT,
    current_approval_step INTEGER DEFAULT 0,
    total_approval_steps INTEGER DEFAULT 0,
    approved_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Versões de Documentos
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id),
    title TEXT,
    description TEXT,
    file_name TEXT,
    file_type TEXT,
    file_size BIGINT,
    file_url TEXT,
    changes_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Workflows de Aprovação
CREATE TABLE IF NOT EXISTS approval_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    document_types TEXT[] DEFAULT '{}', -- Tipos de documento que usam este workflow
    steps JSONB, -- Array de objetos JSON para as etapas de aprovação
    status TEXT DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Aprovações de Documentos
CREATE TABLE IF NOT EXISTS document_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    approver_id UUID REFERENCES profiles(id),
    step_number INTEGER NOT NULL,
    step_name TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Favoritos de Documentos
CREATE TABLE IF NOT EXISTS document_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (document_id, user_id) -- Garante que um usuário só pode favoritar um documento uma vez
);

-- Tabela de Compartilhamento de Documentos
CREATE TABLE IF NOT EXISTS document_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES profiles(id),
    shared_with UUID REFERENCES profiles(id), -- Usuário específico
    shared_email TEXT, -- Email externo
    permission TEXT DEFAULT 'read', -- 'read', 'write'
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL, -- Ex: 'document_created', 'document_approved', 'user_login'
    entity_type TEXT, -- Ex: 'document', 'user', 'department'
    entity_id UUID, -- ID da entidade afetada
    details JSONB, -- Detalhes adicionais da ação
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Convites de Usuários
CREATE TABLE IF NOT EXISTS user_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    token TEXT NOT NULL UNIQUE,
    invited_by UUID REFERENCES profiles(id),
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
