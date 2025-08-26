-- =============================================
-- SCRIPT 5: POPULAÇÃO DE DADOS INICIAIS (SEEDING)
-- =============================================

-- Inserir perfis de exemplo (se não existirem)
INSERT INTO profiles (id, full_name, email, role, status)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin User', 'admin@example.com', 'admin', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, full_name, email, role, status)
VALUES
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Manager User', 'manager@example.com', 'manager', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, full_name, email, role, status)
VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Regular User', 'user@example.com', 'user', 'active')
ON CONFLICT (id) DO NOTHING;

-- Inserir departamentos de exemplo
INSERT INTO departments (id, name, short_name, description, manager_id, color, status)
VALUES
    ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Tecnologia da Informação', 'TI', 'Responsável pela infraestrutura e sistemas de TI.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '#3b82f6', 'active'),
    ('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Recursos Humanos', 'RH', 'Gerencia pessoal, recrutamento e benefícios.', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '#10b981', 'active'),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Financeiro', 'FIN', 'Responsável pelas finanças e contabilidade da empresa.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '#f59e0b', 'active'),
    ('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'Marketing', 'MKT', 'Desenvolve e executa estratégias de marketing.', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '#8b5cf6', 'inactive')
ON CONFLICT (id) DO NOTHING;

-- Inserir tipos de documento de exemplo
INSERT INTO document_types (id, name, description, prefix, color, required_fields, approval_required, retention_period, status)
VALUES
    ('t1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'Política Interna', 'Documentos que estabelecem regras e diretrizes internas.', 'POL', 'blue', ARRAY['title', 'author', 'department', 'description'], TRUE, 60, 'active'),
    ('t2eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'Procedimento Operacional Padrão', 'Instruções detalhadas para a execução de tarefas.', 'POP', 'green', ARRAY['title', 'author', 'department', 'tags', 'steps'], TRUE, 36, 'active'),
    ('t3eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'Relatório Mensal', 'Relatórios de desempenho e atividades mensais.', 'REL', 'yellow', ARRAY['title', 'author', 'department', 'period'], FALSE, 12, 'active'),
    ('t4eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Ata de Reunião', 'Registro formal de discussões e decisões de reuniões.', 'ATA', 'purple', ARRAY['title', 'author', 'date', 'participants', 'decisions'], FALSE, 24, 'active')
ON CONFLICT (id) DO NOTHING;

-- Inserir categorias de documento de exemplo
INSERT INTO categories (id, name, description, color, status)
VALUES
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Segurança da Informação', 'Documentos relacionados à segurança de dados e sistemas.', 'red', 'active'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Recrutamento e Seleção', 'Documentos sobre processos de contratação e seleção de pessoal.', 'green', 'active'),
    ('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'Financeiro e Contábil', 'Documentos de balanços, orçamentos e contabilidade.', 'blue', 'active'),
    ('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'Comunicação Interna', 'Documentos de avisos, comunicados e memorandos internos.', 'yellow', 'inactive')
ON CONFLICT (id) DO NOTHING;

-- Inserir workflows de aprovação de exemplo
INSERT INTO approval_workflows (id, name, description, document_types, steps, status)
VALUES
    ('w1eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'Workflow Padrão de Política', 'Workflow de aprovação para políticas internas.', ARRAY['t1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18']::TEXT[], '[{"name": "Revisão do Gerente", "users": ["Manager User"]}, {"name": "Aprovação Final", "users": ["Admin User"]}]'::JSONB, 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO approval_workflows (id, name, description, document_types, steps, status)
VALUES
    ('w2eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'Workflow de Procedimento', 'Workflow de aprovação para procedimentos operacionais.', ARRAY['t2eebc99-9c0b-4ef8-bb6d-6bb9bd380a19']::TEXT[], '[{"name": "Revisão do Departamento", "users": ["Manager User"]}, {"name": "Aprovação da Qualidade", "users": ["Admin User"]}]'::JSONB, 'active')
ON CONFLICT (id) DO NOTHING;

-- Inserir documentos de exemplo
INSERT INTO documents (id, number, title, author_id, department_id, category_id, document_type_id, workflow_id, version, status, description, tags, file_name, file_type, file_size, file_url, current_approval_step, total_approval_steps, approved_count, approved_at)
VALUES
    ('doc1eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'POL-2023-001', 'Política de Segurança da Informação', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 't1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'w1eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', '1.0', 'approved', 'Documento que estabelece as diretrizes de segurança da informação da empresa.', ARRAY['segurança', 'política', 'TI'], 'politica_seguranca_v1.pdf', 'pdf', 102400, 'https://example.com/docs/politica_seguranca_v1.pdf', 2, 2, 2, NOW()),
    ('doc2eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', 'POP-2023-001', 'POP de Onboarding de Novos Funcionários', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 't2eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'w2eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', '1.0', 'draft', 'Procedimento para integração de novos colaboradores.', ARRAY['onboarding', 'RH', 'procedimento'], 'pop_onboarding_v1.docx', 'word', 51200, 'https://example.com/docs/pop_onboarding_v1.docx', 0, 0, 0, NULL),
    ('doc3eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 'REL-2023-001', 'Relatório Financeiro Mensal - Julho', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 't3eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', NULL, '1.0', 'approved', 'Relatório consolidado das finanças de julho.', ARRAY['financeiro', 'relatório', 'mensal'], 'relatorio_financeiro_julho.xlsx', 'excel', 204800, 'https://example.com/docs/relatorio_financeiro_julho.xlsx', 0, 0, 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir aprovações de exemplo
INSERT INTO document_approvals (document_id, approver_id, step_number, step_name, status, comment, approved_at)
VALUES
    ('doc1eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 1, 'Revisão do Gerente', 'approved', 'Revisado e aprovado.', NOW()),
    ('doc1eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 'Aprovação Final', 'approved', 'Aprovado para publicação.', NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir favoritos de exemplo
INSERT INTO document_favorites (document_id, user_id)
VALUES
    ('doc1eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13')
ON CONFLICT (document_id, user_id) DO NOTHING;

-- Inserir convites de exemplo
INSERT INTO user_invitations (email, token, invited_by, role, expires_at, status)
VALUES
    ('newuser@example.com', 'some_unique_token_123', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'user', NOW() + INTERVAL '7 days', 'pending')
ON CONFLICT (email) DO NOTHING;
