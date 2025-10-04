-- =====================================================
-- IMPORTANTE: Execute este script PRIMEIRO no Supabase
-- =====================================================
-- Este script remove todos os triggers e funções que estão
-- impedindo a criação de novos usuários no sistema.
-- 
-- Como executar:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em SQL Editor
-- 3. Cole e execute este script completo
-- =====================================================

-- Remove o trigger se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remove a função handle_new_user se existir
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Remove a função create_company_with_admin se existir
DROP FUNCTION IF EXISTS public.create_company_with_admin(uuid, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.create_company_with_admin(text, text, text, uuid) CASCADE;

-- Remove qualquer outro trigger relacionado a auth.users
DO $$ 
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT tgname 
        FROM pg_trigger 
        WHERE tgrelid = 'auth.users'::regclass
        AND tgname LIKE '%user%' OR tgname LIKE '%signup%' OR tgname LIKE '%company%'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.tgname || ' ON auth.users CASCADE';
    END LOOP;
END $$;

-- Verifica se ainda existem triggers em auth.users
SELECT 
    tgname as trigger_name,
    proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgrelid = 'auth.users'::regclass;

-- Se a query acima retornar algum resultado, ainda há triggers ativos
-- Se não retornar nada, o banco está limpo e pronto para uso

COMMENT ON TABLE public.companies IS 'Tabela de empresas - triggers removidos, criação via Server Action';
COMMENT ON TABLE public.profiles IS 'Tabela de perfis - triggers removidos, criação via Server Action';
