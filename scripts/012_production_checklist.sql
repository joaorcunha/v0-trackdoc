-- =====================================================
-- CHECKLIST DE PRODUÇÃO - TRACKDOC
-- Data: 2026-04-15
-- =====================================================

-- Este script verifica se o banco está pronto para produção

-- 1. Verificar se RLS está habilitado em todas as tabelas
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN 'OK' ELSE 'PENDENTE' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT IN ('documents_by_category', 'documents_by_department', 'shared_documents', 'user_favorites')
ORDER BY tablename;

-- 2. Verificar funções com SECURITY DEFINER
SELECT 
  proname as function_name,
  CASE WHEN prosecdef THEN 'OK' ELSE 'PENDENTE' END as security_definer
FROM pg_proc 
WHERE proname IN ('is_admin', 'has_permission', 'get_user_company_id');

-- 3. Verificar dados de seed
SELECT 
  'companies' as entity, COUNT(*) as count FROM companies
UNION ALL SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL SELECT 'departments', COUNT(*) FROM departments
UNION ALL SELECT 'document_types', COUNT(*) FROM document_types
UNION ALL SELECT 'categories', COUNT(*) FROM categories
ORDER BY entity;

-- 4. Verificar políticas RLS da tabela profiles (sem recursão)
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;
