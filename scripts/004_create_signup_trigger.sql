-- Function to handle new user signup
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
BEGIN
  -- Get metadata from the new user
  v_company_name := COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company');
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');

  -- Generate unique slug for company
  v_base_slug := LOWER(REGEXP_REPLACE(v_company_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_base_slug := TRIM(BOTH '-' FROM v_base_slug);
  v_random_suffix := SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8);
  v_slug := v_base_slug || '-' || v_random_suffix;

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

  -- Create admin profile for the user
  INSERT INTO public.profiles (
    id,
    company_id,
    email,
    full_name,
    role,
    status
  ) VALUES (
    NEW.id,
    v_company_id,
    NEW.email,
    v_full_name,
    'admin',
    'active'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
