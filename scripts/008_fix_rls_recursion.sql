-- Fix infinite recursion in RLS policies
-- The problem: policies were querying the profiles table to get company_id,
-- which triggered the same policy again, causing infinite recursion.
-- Solution: Create a helper function that bypasses RLS to get user's company_id

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their company profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their company categories" ON categories;
DROP POLICY IF EXISTS "Users can view their company departments" ON departments;
DROP POLICY IF EXISTS "Users can view their company document types" ON document_types;
DROP POLICY IF EXISTS "Users can view their company workflows" ON approval_workflows;
DROP POLICY IF EXISTS "Users can view their company documents" ON documents;

DROP POLICY IF EXISTS "Users can insert their company categories" ON categories;
DROP POLICY IF EXISTS "Users can update their company categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their company categories" ON categories;

DROP POLICY IF EXISTS "Users can insert their company departments" ON departments;
DROP POLICY IF EXISTS "Users can update their company departments" ON departments;
DROP POLICY IF EXISTS "Users can delete their company departments" ON departments;

DROP POLICY IF EXISTS "Users can insert their company document types" ON document_types;
DROP POLICY IF EXISTS "Users can update their company document types" ON document_types;
DROP POLICY IF EXISTS "Users can delete their company document types" ON document_types;

DROP POLICY IF EXISTS "Users can insert their company workflows" ON approval_workflows;
DROP POLICY IF EXISTS "Users can update their company workflows" ON approval_workflows;
DROP POLICY IF EXISTS "Users can delete their company workflows" ON approval_workflows;

DROP POLICY IF EXISTS "Users can insert their company documents" ON documents;
DROP POLICY IF EXISTS "Users can update their company documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their company documents" ON documents;

-- Create helper function that bypasses RLS to get user's company_id
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
DECLARE
  user_company_id UUID;
BEGIN
  SELECT company_id INTO user_company_id
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN user_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies (fixed to avoid recursion)
CREATE POLICY "Users can view their company profiles"
  ON profiles FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Categories policies
CREATE POLICY "Users can view their company categories"
  ON categories FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert their company categories"
  ON categories FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update their company categories"
  ON categories FOR UPDATE
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete their company categories"
  ON categories FOR DELETE
  USING (company_id = get_user_company_id());

-- Departments policies
CREATE POLICY "Users can view their company departments"
  ON departments FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert their company departments"
  ON departments FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update their company departments"
  ON departments FOR UPDATE
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete their company departments"
  ON departments FOR DELETE
  USING (company_id = get_user_company_id());

-- Document Types policies
CREATE POLICY "Users can view their company document types"
  ON document_types FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert their company document types"
  ON document_types FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update their company document types"
  ON document_types FOR UPDATE
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete their company document types"
  ON document_types FOR DELETE
  USING (company_id = get_user_company_id());

-- Approval Workflows policies
CREATE POLICY "Users can view their company workflows"
  ON approval_workflows FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert their company workflows"
  ON approval_workflows FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update their company workflows"
  ON approval_workflows FOR UPDATE
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete their company workflows"
  ON approval_workflows FOR DELETE
  USING (company_id = get_user_company_id());

-- Documents policies
CREATE POLICY "Users can view their company documents"
  ON documents FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert their company documents"
  ON documents FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update their company documents"
  ON documents FOR UPDATE
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete their company documents"
  ON documents FOR DELETE
  USING (company_id = get_user_company_id());
