-- =============================================
-- SCRIPT 10: ATUALIZAÇÃO DAS FUNÇÕES DE DOCUMENT_TYPES
-- =============================================

-- Atualizar função create_document_type para usar template_url
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
    new_document_type_id UUID;
BEGIN
    INSERT INTO document_types (name, description, prefix, color, required_fields, approval_required, retention_period, status, template_url)
    VALUES (p_name, p_description, p_prefix, p_color, p_required_fields, p_approval_required, p_retention_period, p_status, p_template)
    RETURNING id INTO new_document_type_id;

    RETURN QUERY SELECT * FROM document_types WHERE id = new_document_type_id;
END;
$$;

-- Atualizar função update_document_type para usar template_url
CREATE OR REPLACE FUNCTION update_document_type(
    p_id UUID,
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
        status = COALESCE(p_status, status),
        template_url = COALESCE(p_template, template_url)
    WHERE id = p_id;

    RETURN QUERY SELECT * FROM document_types WHERE id = p_id;
END;
$$;

-- Atualizar função delete_document_type para usar UUID
CREATE OR REPLACE FUNCTION delete_document_type(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM document_types WHERE id = p_id;
END;
$$;
