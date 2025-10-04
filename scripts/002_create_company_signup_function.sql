-- Function to create a new company and admin user
CREATE OR REPLACE FUNCTION create_company_with_admin(
  p_company_name TEXT,
  p_user_id UUID,
  p_user_email TEXT,
  p_user_full_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_company_id UUID;
  v_trial_ends_at TIMESTAMP WITH TIME ZONE;
  v_result JSON;
BEGIN
  -- Calculate trial end date (7 days from now)
  v_trial_ends_at := NOW() + INTERVAL '7 days';
  
  -- Create the company
  INSERT INTO companies (
    name,
    slug,
    status,
    subscription_status,
    subscription_plan,
    is_trial,
    trial_started_at,
    trial_ends_at,
    max_users,
    max_storage_gb,
    created_at,
    updated_at
  ) VALUES (
    p_company_name,
    LOWER(REGEXP_REPLACE(p_company_name, '[^a-zA-Z0-9]+', '-', 'g')),
    'active',
    'trial',
    'trial',
    TRUE,
    NOW(),
    v_trial_ends_at,
    5, -- Default max users for trial
    10, -- Default max storage for trial (10GB)
    NOW(),
    NOW()
  )
  RETURNING id INTO v_company_id;
  
  -- Create the admin user profile
  INSERT INTO profiles (
    id,
    email,
    full_name,
    company_id,
    role,
    status,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_user_email,
    p_user_full_name,
    v_company_id,
    'admin',
    'active',
    NOW(),
    NOW()
  );
  
  -- Return success with company info
  v_result := json_build_object(
    'success', TRUE,
    'company_id', v_company_id,
    'trial_ends_at', v_trial_ends_at
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', FALSE,
      'error', SQLERRM
    );
END;
$$;
