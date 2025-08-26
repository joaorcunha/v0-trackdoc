-- Funções para CATEGORIES
CREATE OR REPLACE FUNCTION create_category(
    p_name TEXT,
    p_description TEXT,
    p_color TEXT,
    p_status TEXT
)
RETURNS SETOF categories
LANGUAGE plpgsql
AS $$
DECLARE
    new_category_id INT;
BEGIN
    INSERT INTO categories (name, description, color, status)
    VALUES (p_name, p_description, p_color, p_status::category_status)
    RETURNING id INTO new_category_id;

    RETURN QUERY SELECT * FROM categories WHERE id = new_category_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_category(
    p_id INT,
    p_name TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_color TEXT DEFAULT NULL,
    p_status TEXT DEFAULT NULL
)
RETURNS SETOF categories
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE categories
    SET
        name = COALESCE(p_name, name),
        description = COALESCE(p_description, description),
        color = COALESCE(p_color, color),
        status = COALESCE(p_status::category_status, status)
    WHERE id = p_id;

    RETURN QUERY SELECT * FROM categories WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_category(p_id INT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM categories WHERE id = p_id;
END;
$$;

-- Funções para DEPARTMENTS
CREATE OR REPLACE FUNCTION create_department(
    p_name TEXT,
    p_short_name TEXT,
    p_status TEXT
)
RETURNS SETOF departments
LANGUAGE plpgsql
AS $$
DECLARE
    new_department_id INT;
BEGIN
    INSERT INTO departments (name, short_name, status)
    VALUES (p_name, p_short_name, p_status::department_status)
    RETURNING id INTO new_department_id;

    RETURN QUERY SELECT * FROM departments WHERE id = new_department_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_department(
    p_id INT,
    p_name TEXT DEFAULT NULL,
    p_short_name TEXT DEFAULT NULL,
    p_status TEXT DEFAULT NULL
)
RETURNS SETOF departments
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE departments
    SET
        name = COALESCE(p_name, name),
        short_name = COALESCE(p_short_name, short_name),
        status = COALESCE(p_status::department_status, status)
    WHERE id = p_id;

    RETURN QUERY SELECT * FROM departments WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_department(p_id INT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM departments WHERE id = p_id;
END;
$$;

-- Funções para DOCUMENT_TYPES
CREATE OR REPLACE FUNCTION create_document_type(
    p_name TEXT,
    p_description TEXT,
    p_prefix TEXT,
    p_color TEXT,
    p_required_fields TEXT[],
    p_approval_required BOOLEAN,
    p_retention_period INT,
    p_status TEXT,
    p_template TEXT
)
RETURNS SETOF document_types
LANGUAGE plpgsql
AS $$
DECLARE
    new_document_type_id INT;
BEGIN
    INSERT INTO document_types (name, description, prefix, color, required_fields, approval_required, retention_period, status, template)
    VALUES (p_name, p_description, p_prefix, p_color, p_required_fields, p_approval_required, p_retention_period, p_status::document_type_status, p_template)
    RETURNING id INTO new_document_type_id;

    RETURN QUERY SELECT * FROM document_types WHERE id = new_document_type_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_document_type(
    p_id INT,
    p_name TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_prefix TEXT DEFAULT NULL,
    p_color TEXT DEFAULT NULL,
    p_required_fields TEXT[] DEFAULT NULL,
    p_approval_required BOOLEAN DEFAULT NULL,
    p_retention_period INT DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_template TEXT DEFAULT NULL
)
RETURNS SETOF document_types
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE document_types
    SET
        name = COALESCE(p_name, name),
        description = COALESCE(p_description, description),
        prefix = COALESCE(p_prefix, prefix),
        color = COALESCE(p_color, color),
        required_fields = COALESCE(p_required_fields, required_fields),
        approval_required = COALESCE(p_approval_required, approval_required),
        retention_period = COALESCE(p_retention_period, retention_period),
        status = COALESCE(p_status::document_type_status, status),
        template = COALESCE(p_template, template)
    WHERE id = p_id;

    RETURN QUERY SELECT * FROM document_types WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_document_type(p_id INT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM document_types WHERE id = p_id;
END;
$$;
