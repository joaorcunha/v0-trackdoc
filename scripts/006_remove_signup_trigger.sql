-- Remove o trigger que está causando erro ao criar usuários
-- Este trigger será substituído por lógica server-side

-- Remove o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remove a função do trigger
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE 'Trigger de signup removido com sucesso. A criação de empresa e profile agora é feita via Server Action.';
END $$;
