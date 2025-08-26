-- =============================================
-- SCRIPT 6: VIEWS PARA RELATÓRIOS E CONSULTAS
-- =============================================

-- View para dashboard com estatísticas
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM documents) as total_documents,
    (SELECT COUNT(*) FROM documents WHERE status = 'approved') as approved_documents,
    (SELECT COUNT(*) FROM documents WHERE status = 'pending') as pending_documents,
    (SELECT COUNT(*) FROM documents WHERE status = 'draft') as draft_documents,
    (SELECT COUNT(*) FROM documents WHERE status = 'rejected') as rejected_documents,
    (SELECT COUNT(*) FROM profiles WHERE status = 'active') as active_users,
    (SELECT COUNT(*) FROM departments WHERE status = 'active') as active_departments,
    (SELECT COUNT(*) FROM categories WHERE status = 'active') as active_categories;

-- View para documentos com informações completas
CREATE OR REPLACE VIEW documents_full AS
SELECT 
    d.id,
    d.number,
    d.title,
    d.version,
    d.status,
    d.description,
    d.tags,
    d.file_name,
    d.file_type,
    d.file_size,
    d.file_url,
    d.current_approval_step,
    d.total_approval_steps,
    d.approved_count,
    d.created_at,
    d.updated_at,
    d.approved_at,
    d.expires_at,
    
    -- Informações do autor
    p.full_name as author_name,
    p.email as author_email,
    
    -- Informações do departamento
    dept.name as department_name,
    dept.short_name as department_short_name,
    dept.color as department_color,
    
    -- Informações da categoria
    cat.name as category_name,
    cat.color as category_color,
    
    -- Informações do tipo
    dt.name as document_type_name,
    dt.prefix as document_type_prefix,
    
    -- Informações do workflow
    wf.name as workflow_name
    
FROM documents d
LEFT JOIN profiles p ON d.author_id = p.id
LEFT JOIN departments dept ON d.department_id = dept.id
LEFT JOIN categories cat ON d.category_id = cat.id
LEFT JOIN document_types dt ON d.document_type_id = dt.id
LEFT JOIN approval_workflows wf ON d.workflow_id = wf.id;

-- View para relatório de produtividade por usuário
CREATE OR REPLACE VIEW user_productivity_report AS
SELECT 
    p.id as user_id,
    p.full_name,
    p.email,
    dept.name as department_name,
    COUNT(d.id) as total_documents,
    COUNT(CASE WHEN d.status = 'approved' THEN 1 END) as approved_documents,
    COUNT(CASE WHEN d.status = 'pending' THEN 1 END) as pending_documents,
    COUNT(CASE WHEN d.status = 'draft' THEN 1 END) as draft_documents,
    COUNT(CASE WHEN d.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as documents_last_30_days,
    MAX(d.created_at) as last_document_created
FROM profiles p
LEFT JOIN documents d ON p.id = d.author_id
LEFT JOIN departments dept ON p.department_id = dept.id
WHERE p.status = 'active'
GROUP BY p.id, p.full_name, p.email, dept.name
ORDER BY total_documents DESC;

-- View para relatório de tempo de aprovação
CREATE OR REPLACE VIEW approval_time_report AS
SELECT 
    d.id as document_id,
    d.number,
    d.title,
    d.status,
    d.created_at,
    d.approved_at,
    CASE 
        WHEN d.approved_at IS NOT NULL THEN 
            EXTRACT(EPOCH FROM (d.approved_at - d.created_at)) / 86400
        ELSE 
            EXTRACT(EPOCH FROM (NOW() - d.created_at)) / 86400
    END as days_in_approval,
    dept.name as department_name,
    dt.name as document_type_name,
    p.full_name as author_name
FROM documents d
LEFT JOIN departments dept ON d.department_id = dept.id
LEFT JOIN document_types dt ON d.document_type_id = dt.id
LEFT JOIN profiles p ON d.author_id = p.id
WHERE d.status IN ('pending', 'approved', 'rejected')
ORDER BY days_in_approval DESC;

-- View para documentos por departamento
CREATE OR REPLACE VIEW documents_by_department AS
SELECT 
    dept.id as department_id,
    dept.name as department_name,
    dept.short_name,
    dept.color,
    COUNT(d.id) as total_documents,
    COUNT(CASE WHEN d.status = 'approved' THEN 1 END) as approved_documents,
    COUNT(CASE WHEN d.status = 'pending' THEN 1 END) as pending_documents,
    COUNT(CASE WHEN d.status = 'draft' THEN 1 END) as draft_documents,
    COUNT(CASE WHEN d.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as documents_last_30_days
FROM departments dept
LEFT JOIN documents d ON dept.id = d.department_id
WHERE dept.status = 'active'
GROUP BY dept.id, dept.name, dept.short_name, dept.color
ORDER BY total_documents DESC;

-- View para documentos por categoria
CREATE OR REPLACE VIEW documents_by_category AS
SELECT 
    cat.id as category_id,
    cat.name as category_name,
    cat.color,
    COUNT(d.id) as total_documents,
    COUNT(CASE WHEN d.status = 'approved' THEN 1 END) as approved_documents,
    COUNT(CASE WHEN d.status = 'pending' THEN 1 END) as pending_documents,
    COUNT(CASE WHEN d.status = 'draft' THEN 1 END) as draft_documents
FROM categories cat
LEFT JOIN documents d ON cat.id = d.category_id
WHERE cat.status = 'active'
GROUP BY cat.id, cat.name, cat.color
ORDER BY total_documents DESC;

-- View para auditoria completa
CREATE OR REPLACE VIEW audit_report AS
SELECT 
    al.id,
    al.action,
    al.details,
    al.created_at,
    al.ip_address,
    
    -- Informações do usuário
    p.full_name as user_name,
    p.email as user_email,
    dept.name as user_department,
    
    -- Informações do documento
    d.number as document_number,
    d.title as document_title,
    d.status as document_status
    
FROM audit_logs al
LEFT JOIN profiles p ON al.user_id = p.id
LEFT JOIN departments dept ON p.department_id = dept.id
LEFT JOIN documents d ON al.document_id = d.id
ORDER BY al.created_at DESC;

-- View para documentos favoritos por usuário
CREATE OR REPLACE VIEW user_favorites AS
SELECT 
    df.user_id,
    p.full_name as user_name,
    d.id as document_id,
    d.number,
    d.title,
    d.status,
    d.created_at as document_created_at,
    df.created_at as favorited_at
FROM document_favorites df
JOIN profiles p ON df.user_id = p.id
JOIN documents d ON df.document_id = d.id
ORDER BY df.created_at DESC;

-- View para documentos compartilhados
CREATE OR REPLACE VIEW shared_documents AS
SELECT 
    ds.id as share_id,
    ds.permission,
    ds.expires_at,
    ds.access_count,
    ds.last_accessed,
    ds.created_at as shared_at,
    
    -- Documento
    d.id as document_id,
    d.number,
    d.title,
    d.status,
    
    -- Quem compartilhou
    p1.full_name as shared_by_name,
    p1.email as shared_by_email,
    
    -- Com quem foi compartilhado
    p2.full_name as shared_with_name,
    p2.email as shared_with_email,
    ds.shared_email
    
FROM document_shares ds
JOIN documents d ON ds.document_id = d.id
JOIN profiles p1 ON ds.shared_by = p1.id
LEFT JOIN profiles p2 ON ds.shared_with = p2.id
ORDER BY ds.created_at DESC;
