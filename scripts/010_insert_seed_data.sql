-- Script para inserir dados iniciais de departamentos, tipos de documento e categorias
-- Executado em: 2026-04-15

DO $$
DECLARE
  v_company_id UUID;
BEGIN
  SELECT id INTO v_company_id FROM companies LIMIT 1;
  
  -- Insert departments
  INSERT INTO departments (name, short_name, description, company_id, status) VALUES
    ('Tecnologia da Informação', 'TI', 'Departamento de TI', v_company_id, 'active'),
    ('Recursos Humanos', 'RH', 'Departamento de RH', v_company_id, 'active'),
    ('Financeiro', 'FIN', 'Departamento Financeiro', v_company_id, 'active'),
    ('Vendas', 'VEN', 'Departamento de Vendas', v_company_id, 'active'),
    ('Marketing', 'MKT', 'Departamento de Marketing', v_company_id, 'active'),
    ('Operações', 'OPS', 'Departamento de Operações', v_company_id, 'active'),
    ('Jurídico', 'JUR', 'Departamento Jurídico', v_company_id, 'active'),
    ('Diretoria', 'DIR', 'Diretoria Executiva', v_company_id, 'active')
  ON CONFLICT DO NOTHING;
  
  -- Insert document types (prefix max 3 chars)
  INSERT INTO document_types (name, prefix, description, company_id, status) VALUES
    ('Política', 'POL', 'Documentos de políticas corporativas', v_company_id, 'active'),
    ('Procedimento', 'PRC', 'Procedimentos operacionais', v_company_id, 'active'),
    ('Manual', 'MAN', 'Manuais e guias', v_company_id, 'active'),
    ('Relatório', 'REL', 'Relatórios diversos', v_company_id, 'active'),
    ('Ata', 'ATA', 'Atas de reunião', v_company_id, 'active'),
    ('Plano', 'PLN', 'Planos e planejamentos', v_company_id, 'active'),
    ('Contrato', 'CTR', 'Contratos e acordos', v_company_id, 'active')
  ON CONFLICT DO NOTHING;
  
  -- Insert categories
  INSERT INTO categories (name, description, color, company_id, status) VALUES
    ('Gestão', 'Documentos de gestão corporativa', '#3B82F6', v_company_id, 'active'),
    ('Compliance', 'Documentos de conformidade e regulatório', '#10B981', v_company_id, 'active'),
    ('Operacional', 'Documentos operacionais do dia a dia', '#F59E0B', v_company_id, 'active'),
    ('Estratégico', 'Documentos estratégicos da empresa', '#8B5CF6', v_company_id, 'active'),
    ('RH', 'Documentos de recursos humanos', '#EC4899', v_company_id, 'active'),
    ('Financeiro', 'Documentos financeiros', '#06B6D4', v_company_id, 'active')
  ON CONFLICT DO NOTHING;
END $$;
