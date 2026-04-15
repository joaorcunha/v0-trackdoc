"use server"

import { createAdminClient } from "@/lib/supabase/admin"

interface SignupData {
  email: string
  password: string
  fullName: string
  companyName: string
}

interface SignupResult {
  success: boolean
  error?: string
  userId?: string
}

function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  const randomSuffix = Math.random().toString(36).substring(2, 10)
  return `${baseSlug}-${randomSuffix}`
}

export async function signupUser(data: SignupData): Promise<SignupResult> {
  try {
    const adminClient = createAdminClient()

    // Step 1: Create company first
    const companySlug = generateSlug(data.companyName)
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)

    const { data: companyData, error: companyError } = await adminClient
      .from("companies")
      .insert({
        name: data.companyName,
        slug: companySlug,
        subscription_plan: "trial",
        subscription_status: "active",
        is_trial: true,
        trial_started_at: new Date().toISOString(),
        trial_ends_at: trialEndsAt.toISOString(),
        max_storage_gb: 10,
        max_users: 5,
      })
      .select()
      .single()

    if (companyError) {
      return {
        success: false,
        error: "Erro ao criar empresa: " + companyError.message,
      }
    }

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Auto-confirm email to avoid SMTP configuration issues
      user_metadata: {
        full_name: data.fullName,
        company_name: data.companyName,
        company_id: companyData.id,
      },
    })

    if (authError) {
      if (authError.message.includes("Database error")) {
        await adminClient.from("companies").delete().eq("id", companyData.id)
        return {
          success: false,
          error:
            "Há um trigger no banco de dados impedindo a criação de usuários. Por favor, execute o script 'EXECUTE_FIRST_cleanup_all_triggers.sql' no Supabase SQL Editor.",
        }
      }

      await adminClient.from("companies").delete().eq("id", companyData.id)
      return {
        success: false,
        error: authError.message,
      }
    }

    if (!authData.user) {
      await adminClient.from("companies").delete().eq("id", companyData.id)
      return {
        success: false,
        error: "Erro ao criar usuário",
      }
    }

    const userId = authData.user.id

    // Step 3: Create profile using admin client
    const { error: profileError } = await adminClient.from("profiles").insert({
      id: userId,
      company_id: companyData.id,
      email: data.email,
      full_name: data.fullName,
      role: "admin",
      status: "active",
    })

    if (profileError) {
      await adminClient.from("companies").delete().eq("id", companyData.id)
      await adminClient.auth.admin.deleteUser(userId)
      return {
        success: false,
        error: "Erro ao criar perfil: " + profileError.message,
      }
    }

    return {
      success: true,
      userId,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro inesperado ao criar conta",
    }
  }
}
