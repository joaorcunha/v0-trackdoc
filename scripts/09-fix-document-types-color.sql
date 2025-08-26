-- =============================================
-- SCRIPT 9: CORREÇÃO DA COLUNA COLOR EM DOCUMENT_TYPES
-- =============================================

-- Adicionar coluna color se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'document_types' 
        AND column_name = 'color'
    ) THEN
        ALTER TABLE document_types ADD COLUMN color TEXT;
    END IF;
END $$;

-- Adicionar coluna template_url se não existir (renomeada de template)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'document_types' 
        AND column_name = 'template_url'
    ) THEN
        ALTER TABLE document_types ADD COLUMN template_url TEXT;
    END IF;
END $$;

-- Remover coluna template se existir (nome antigo)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'document_types' 
        AND column_name = 'template'
    ) THEN
        ALTER TABLE document_types DROP COLUMN template;
    END IF;
END $$;
