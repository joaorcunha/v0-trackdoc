-- Remove any existing triggers that might interfere with user creation
-- This script ensures a clean state for the signup process

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop function if exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop any other signup-related triggers
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- Verify triggers are removed
SELECT 
  trigger_name, 
  event_object_table, 
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public' OR trigger_schema = 'auth';
