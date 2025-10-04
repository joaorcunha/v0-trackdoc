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

  // Add random suffix to ensure uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 10)
  return `${baseSlug}-${randomSuffix}`
}

export async function signupUser(data: SignupData): Promise<SignupResult> {
  try {
    console.log("[v0] Server: Iniciando cadastro para:", data.email)

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
      console.error("[v0] Server: Erro ao criar empresa:", companyError)
      return {
        success: false,
        error: "Erro ao criar empresa: " + companyError.message,
      }
    }

    console.log("[v0] Server: Empresa criada com ID:", companyData.id)

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: false, // This will send confirmation email if SMTP is configured
      user_metadata: {
        full_name: data.fullName,
        company_name: data.companyName,
        company_id: companyData.id,
      },
    })

    if (authError) {
      console.error("[v0] Server: Erro ao criar usuário:", authError)

      if (authError.message.includes("Database error")) {
        // Rollback: delete company
        await adminClient.from("companies").delete().eq("id", companyData.id)
        return {
          success: false,
          error:
            "Há um trigger no banco de dados impedindo a criação de usuários. Por favor, execute o script 'EXECUTE_FIRST_cleanup_all_triggers.sql' no Supabase SQL Editor.",
        }
      }

      // Rollback: delete company
      await adminClient.from("companies").delete().eq("id", companyData.id)
      return {
        success: false,
        error: authError.message,
      }
    }

    if (!authData.user) {
      console.error("[v0] Server: Usuário não foi criado")
      // Rollback: delete company
      await adminClient.from("companies").delete().eq("id", companyData.id)
      return {
        success: false,
        error: "Erro ao criar usuário",
      }
    }

    const userId = authData.user.id
    console.log("[v0] Server: Usuário criado com ID:", userId)

    // Step 3: Create profile
    const { error: profileError } = await adminClient.from("profiles").insert({
      id: userId,
      company_id: companyData.id,
      email: data.email,
      full_name: data.fullName,
      role: "admin",
      status: "active",
    })

    if (profileError) {
      console.error("[v0] Server: Erro ao criar perfil:", profileError)
      // Rollback: delete company and user
      await adminClient.from("companies").delete().eq("id", companyData.id)
      await adminClient.auth.admin.deleteUser(userId)
      return {
        success: false,
        error: "Erro ao criar perfil: " + profileError.message,
      }
    }

    console.log("[v0] Server: Perfil criado com sucesso")

    try {
      const redirectTo = process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/login`
        : "http://localhost:3000/login"

      console.log("[v0] Server: Gerando link de confirmação com redirect para:", redirectTo)

      const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
        type: "signup",
        email: data.email,
        options: {
          redirectTo,
        },
      })

      if (linkError) {
        console.error("[v0] Server: Erro ao gerar link de confirmação:", linkError)
        // Don't fail the signup, just log the error
        console.log("[v0] Server: Email de confirmação não foi enviado, mas o usuário foi criado")
      } else {
        console.log("[v0] Server: Link de confirmação gerado com sucesso")
        console.log("[v0] Server: IMPORTANTE - Configure o SMTP no Supabase para enviar emails automaticamente")
        console.log("[v0] Server: Link de confirmação (para desenvolvimento):", linkData.properties?.action_link)
      }
    } catch (emailError) {
      console.error("[v0] Server: Erro ao enviar email de confirmação:", emailError)
      // Don't fail the signup, just log the error
    }

    return {
      success: true,
      userId,
    }
  } catch (error: any) {
    console.error("[v0] Server: Erro inesperado:", error)
    return {
      success: false,
      error: error.message || "Erro inesperado ao criar conta",
    }
  }
}
