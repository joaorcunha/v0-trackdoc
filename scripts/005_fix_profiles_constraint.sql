-- Drop existing constraint if it exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add the correct foreign key constraint
-- The id in profiles should reference auth.users(id)
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_company_id UUID;
  v_slug TEXT;
  v_base_slug TEXT;
  v_random_suffix TEXT;
  v_trial_end TIMESTAMP WITH TIME ZONE;
  v_company_name TEXT;
  v_full_name TEXT;
  v_attempt INTEGER := 0;
  v_max_attempts INTEGER := 10;
BEGIN
  -- Get metadata from the new user
  v_company_name := COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company');
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');

  -- Generate unique slug for company with retry logic
  LOOP
    v_attempt := v_attempt + 1;
    EXIT WHEN v_attempt > v_max_attempts;

    -- Generate slug
    v_base_slug := LOWER(REGEXP_REPLACE(v_company_name, '[^a-zA-Z0-9]+', '-', 'g'));
    v_base_slug := TRIM(BOTH '-' FROM v_base_slug);
    v_random_suffix := SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8);
    v_slug := v_base_slug || '-' || v_random_suffix;

    -- Try to insert company
    BEGIN
      -- Calculate trial end date (7 days from now)
      v_trial_end := NOW() + INTERVAL '7 days';

      -- Create company
      INSERT INTO public.companies (
        name,
        slug,
        subscription_plan,
        subscription_status,
        is_trial,
        trial_started_at,
        trial_ends_at,
        max_users,
        max_storage_gb,
        status
      ) VALUES (
        v_company_name,
        v_slug,
        'trial',
        'trialing',
        TRUE,
        NOW(),
        v_trial_end,
        5,
        10,
        'active'
      )
      RETURNING id INTO v_company_id;

      -- If we got here, the insert succeeded, exit the loop
      EXIT;
    EXCEPTION
      WHEN unique_violation THEN
        -- Slug already exists, try again with a new random suffix
        IF v_attempt >= v_max_attempts THEN
          RAISE EXCEPTION 'Failed to generate unique company slug after % attempts', v_max_attempts;
        END IF;
        CONTINUE;
    END;
  END LOOP;

  -- Create admin profile for the user
  -- This happens after the company is created successfully
  INSERT INTO public.profiles (
    id,
    company_id,
    email,
    full_name,
    role,
    status,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    v_company_id,
    NEW.email,
    v_full_name,
    'admin',
    'active',
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (you can check postgres logs)
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    -- Re-raise the exception to rollback the transaction
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
