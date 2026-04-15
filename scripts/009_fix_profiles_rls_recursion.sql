-- Script para corrigir problema de recursão infinita nas políticas RLS da tabela profiles
-- Executado em: 2026-04-15
-- Problema: As políticas antigas usavam funções is_admin() e has_permission() que consultavam
-- a própria tabela profiles, causando recursão infinita.

-- Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_same_company" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;

-- Create simple, non-recursive policies
-- Policy 1: Users can view their own profile (using only auth.uid())
CREATE POLICY "profiles_view_own" ON profiles
    FOR SELECT USING (id = auth.uid());

-- Policy 2: Users can view profiles in same company (using SECURITY DEFINER function)
CREATE POLICY "profiles_view_company" ON profiles
    FOR SELECT USING (company_id = get_user_company_id());

-- Policy 3: Users can insert their own profile
CREATE POLICY "profiles_insert" ON profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- Policy 4: Users can update their own profile
CREATE POLICY "profiles_update" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- Policy 5: Users can delete their own profile (admin operations use service role)
CREATE POLICY "profiles_delete" ON profiles
    FOR DELETE USING (id = auth.uid());
