-- Seed Departments
INSERT INTO departments (name, description) VALUES
('Recursos Humanos', 'Departamento responsável pela gestão de pessoas e cultura organizacional.'),
('Financeiro', 'Departamento responsável pela gestão financeira e contabilidade.'),
('Marketing', 'Departamento responsável pela promoção de produtos e serviços.'),
('Tecnologia', 'Departamento responsável pelo desenvolvimento e manutenção de sistemas.'),
('Jurídico', 'Departamento responsável pela consultoria e conformidade legal.')
ON CONFLICT (name) DO NOTHING;

-- Seed Categories
INSERT INTO categories (name, description) VALUES
('Políticas Internas', 'Documentos que regem as diretrizes e normas da empresa.'),
('Relatórios', 'Documentos que apresentam dados e análises de desempenho.'),
('Contratos', 'Documentos legais que formalizam acordos.'),
('Manuais', 'Documentos de instrução e guia para procedimentos.'),
('Atas de Reunião', 'Registros formais de reuniões.')
ON CONFLICT (name) DO NOTHING;

-- Seed Document Types
INSERT INTO document_types (name, description) VALUES
('Política', 'Documento que estabelece princípios e diretrizes gerais.'),
('Procedimento', 'Documento que detalha os passos para a execução de uma tarefa.'),
('Relatório', 'Documento que apresenta informações e análises.'),
('Ata', 'Registro oficial de uma reunião.'),
('Contrato', 'Acordo legal entre duas ou mais partes.'),
('Manual', 'Guia detalhado sobre um sistema ou processo.')
ON CONFLICT (name) DO NOTHING;

-- Seed Approval Workflows (simplified for initial setup)
INSERT INTO approval_workflows (name, description, status) VALUES
('Aprovação Simples', 'Fluxo de aprovação com apenas uma etapa.', 'active'),
('Aprovação Dupla', 'Fluxo de aprovação com duas etapas sequenciais.', 'active'),
('Aprovação por Departamento', 'Fluxo de aprovação que requer aprovação do chefe de departamento.', 'active'),
('Aprovação Gerencial', 'Fluxo de aprovação que requer aprovação de um gerente.', 'active')
ON CONFLICT (name) DO NOTHING;

-- Seed a default admin user (replace with secure password hashing in production)
INSERT INTO users (email, password_hash, name, last_name, role) VALUES
('admin@example.com', 'hashed_password_here', 'Admin', 'User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed a default editor user
INSERT INTO users (email, password_hash, name, last_name, role) VALUES
('editor@example.com', 'hashed_password_here', 'Editor', 'User', 'editor')
ON CONFLICT (email) DO NOTHING;

-- Seed a default viewer user
INSERT INTO users (email, password_hash, name, last_name, role) VALUES
('viewer@example.com', 'hashed_password_here', 'Viewer', 'User', 'viewer')
ON CONFLICT (email) DO NOTHING;
