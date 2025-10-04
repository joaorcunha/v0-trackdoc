-- Enable RLS on all tables that need company isolation
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their company categories" ON categories;
DROP POLICY IF EXISTS "Users can insert their company categories" ON categories;
DROP POLICY IF EXISTS "Users can update their company categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their company categories" ON categories;

DROP POLICY IF EXISTS "Users can view their company departments" ON departments;
DROP POLICY IF EXISTS "Users can insert their company departments" ON departments;
DROP POLICY IF EXISTS "Users can update their company departments" ON departments;
DROP POLICY IF EXISTS "Users can delete their company departments" ON departments;

DROP POLICY IF EXISTS "Users can view their company document types" ON document_types;
DROP POLICY IF EXISTS "Users can insert their company document types" ON document_types;
DROP POLICY IF EXISTS "Users can update their company document types" ON document_types;
DROP POLICY IF EXISTS "Users can delete their company document types" ON document_types;

DROP POLICY IF EXISTS "Users can view their company workflows" ON approval_workflows;
DROP POLICY IF EXISTS "Users can insert their company workflows" ON approval_workflows;
DROP POLICY IF EXISTS "Users can update their company workflows" ON approval_workflows;
DROP POLICY IF EXISTS "Users can delete their company workflows" ON approval_workflows;

DROP POLICY IF EXISTS "Users can view their company documents" ON documents;
DROP POLICY IF EXISTS "Users can insert their company documents" ON documents;
DROP POLICY IF EXISTS "Users can update their company documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their company documents" ON documents;

DROP POLICY IF EXISTS "Users can view their company profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Categories policies
CREATE POLICY "Users can view their company categories"
  ON categories FOR SELECT
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company categories"
  ON categories FOR INSERT
  WITH CHECK (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company categories"
  ON categories FOR UPDATE
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company categories"
  ON categories FOR DELETE
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Departments policies
CREATE POLICY "Users can view their company departments"
  ON departments FOR SELECT
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company departments"
  ON departments FOR INSERT
  WITH CHECK (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company departments"
  ON departments FOR UPDATE
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company departments"
  ON departments FOR DELETE
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Document Types policies
CREATE POLICY "Users can view their company document types"
  ON document_types FOR SELECT
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company document types"
  ON document_types FOR INSERT
  WITH CHECK (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company document types"
  ON document_types FOR UPDATE
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company document types"
  ON document_types FOR DELETE
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Approval Workflows policies
CREATE POLICY "Users can view their company workflows"
  ON approval_workflows FOR SELECT
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company workflows"
  ON approval_workflows FOR INSERT
  WITH CHECK (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company workflows"
  ON approval_workflows FOR UPDATE
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company workflows"
  ON approval_workflows FOR DELETE
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Documents policies
CREATE POLICY "Users can view their company documents"
  ON documents FOR SELECT
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company documents"
  ON documents FOR INSERT
  WITH CHECK (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company documents"
  ON documents FOR UPDATE
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company documents"
  ON documents FOR DELETE
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Profiles policies
CREATE POLICY "Users can view their company profiles"
  ON profiles FOR SELECT
  USING (
    company_id = (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());
