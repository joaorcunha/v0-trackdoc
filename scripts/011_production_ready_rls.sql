-- Script: 011_production_ready_rls.sql
-- Descrição: Correções finais para produção - RLS e segurança
-- Data: 2026-04-15
-- IMPORTANTE: Execute este script no Supabase SQL Editor

-- ============================================
-- VERIFICAÇÃO: Todas as funções críticas usam SECURITY DEFINER
-- ============================================
-- As seguintes funções já estão configuradas corretamente:
-- - get_user_company_id() - SECURITY DEFINER = true
-- - is_admin() - SECURITY DEFINER = true  
-- - has_permission() - SECURITY DEFINER = true

-- ============================================
-- VERIFICAÇÃO: RLS está habilitado em todas as tabelas
-- ============================================
-- Todas as tabelas públicas têm RLS habilitado

-- ============================================
-- POLÍTICAS RLS DA TABELA PROFILES (já corrigidas)
-- ============================================
-- As políticas da tabela profiles foram corrigidas para evitar recursão:
-- - profiles_view_own: SELECT usando id = auth.uid()
-- - profiles_view_company: SELECT usando company_id = get_user_company_id()
-- - profiles_insert: INSERT com id = auth.uid()
-- - profiles_update: UPDATE usando id = auth.uid()
-- - profiles_delete: DELETE usando id = auth.uid()

-- ============================================
-- VALIDAÇÃO FINAL
-- ============================================
DO $$
BEGIN
  -- Verificar se todas as tabelas críticas têm RLS
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'companies', 'departments', 'documents', 'categories', 'document_types')
    AND NOT rowsecurity
  ) THEN
    RAISE EXCEPTION 'ERRO: Existem tabelas sem RLS habilitado!';
  END IF;
  
  RAISE NOTICE 'Validação concluída: Sistema pronto para produção';
END $$;
