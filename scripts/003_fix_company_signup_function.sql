-- =============================================
-- SCRIPT: CORREÇÃO DA FUNÇÃO DE CADASTRO DE EMPRESA
-- =============================================

-- Remove a função antiga se existir
DROP FUNCTION IF EXISTS create_company_with_admin(TEXT, TEXT, TEXT, TEXT);

-- Cria a função corrigida de cadastro de empresa e admin
CREATE OR REPLACE FUNCTION create_company_with_admin(
    p_user_id UUID,
    p_email TEXT,
    p_full_name TEXT,
    p_company_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company_id UUID;
    v_slug TEXT;
    v_base_slug TEXT;
    v_random_suffix TEXT;
    v_slug_exists BOOLEAN;
    v_attempt_count INTEGER := 0;
    v_max_attempts INTEGER := 10;
BEGIN
    -- Gera o slug base a partir do nome da empresa
    v_base_slug := LOWER(REGEXP_REPLACE(p_company_name, '[^a-zA-Z0-9]+', '-', 'g'));
    v_base_slug := TRIM(BOTH '-' FROM v_base_slug);
    
    -- Loop para encontrar um slug único
    LOOP
        -- Gera um sufixo aleatório de 8 caracteres
        v_random_suffix := LOWER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));
        
        -- Combina o slug base com o sufixo
        v_slug := v_base_slug || '-' || v_random_suffix;
        
        -- Verifica se o slug já existe
        SELECT EXISTS(SELECT 1 FROM companies WHERE slug = v_slug) INTO v_slug_exists;
        
        -- Se o slug não existe, sai do loop
        EXIT WHEN NOT v_slug_exists;
        
        -- Incrementa o contador de tentativas
        v_attempt_count := v_attempt_count + 1;
        
        -- Se exceder o máximo de tentativas, lança erro
        IF v_attempt_count >= v_max_attempts THEN
            RAISE EXCEPTION 'Não foi possível gerar um slug único após % tentativas', v_max_attempts;
        END IF;
    END LOOP;
    
    -- Cria a empresa
    INSERT INTO companies (
        name,
        slug,
        status,
        is_trial,
        trial_started_at,
        trial_ends_at,
        subscription_status,
        subscription_plan,
        max_users,
        max_storage_gb,
        settings
    ) VALUES (
        p_company_name,
        v_slug,
        'active',
        TRUE,
        NOW(),
        NOW() + INTERVAL '7 days',
        'trialing',
        'trial',
        5,
        10,
        '{"notifications_enabled": true, "auto_approval": false}'::jsonb
    )
    RETURNING id INTO v_company_id;
    
    -- Cria o perfil do usuário admin usando o user_id do auth
    INSERT INTO profiles (
        id,
        email,
        full_name,
        role,
        status,
        company_id,
        created_at,
        updated_at
    ) VALUES (
        p_user_id,
        p_email,
        p_full_name,
        'admin',
        'active',
        v_company_id,
        NOW(),
        NOW()
    );
    
    -- Retorna os dados da empresa e do usuário
    RETURN jsonb_build_object(
        'company_id', v_company_id,
        'company_name', p_company_name,
        'company_slug', v_slug,
        'user_id', p_user_id,
        'user_email', p_email,
        'user_role', 'admin',
        'trial_ends_at', NOW() + INTERVAL '7 days'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Erro ao criar empresa e usuário: %', SQLERRM;
END;
$$;

-- Concede permissões de execução para usuários autenticados
GRANT EXECUTE ON FUNCTION create_company_with_admin(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- Comentário da função
COMMENT ON FUNCTION create_company_with_admin IS 'Cria uma nova empresa com período de trial de 7 dias e o usuário admin associado';
