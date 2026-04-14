"use server"

import { createClient } from "@/lib/supabase/server"

interface LoginData {
  email: string
  password: string
}

interface LoginResult {
  success: boolean
  error?: string
  emailConfirmed?: boolean
}

export async function loginUser(data: LoginData): Promise<LoginResult> {
  try {
    console.log("[v0] Server: Tentando login para:", data.email)

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("[v0] Server: Variáveis de ambiente do Supabase não configuradas")
      return {
        success: false,
        error: "Erro de configuração do servidor. Contate o suporte.",
      }
    }

    const supabase = await createClient()

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      console.error("[v0] Server: Erro de autenticação:", authError.message, authError.status)
      
      // Handle specific error cases
      if (authError.message?.includes("Invalid login credentials")) {
        return {
          success: false,
          error: "Email ou senha incorretos",
        }
      }
      
      if (authError.message?.includes("Email not confirmed")) {
        return {
          success: false,
          error: "Por favor, confirme seu email antes de fazer login.",
          emailConfirmed: false,
        }
      }
      
      return {
        success: false,
        error: authError.message || "Erro ao fazer login",
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Email ou senha incorretos",
      }
    }

    if (!authData.user.email_confirmed_at) {
      console.log("[v0] Server: Email não confirmado para:", authData.user.email)
      return {
        success: false,
        error: "Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.",
        emailConfirmed: false,
      }
    }

    console.log("[v0] Server: Login realizado com sucesso para:", authData.user.email)

    return {
      success: true,
      emailConfirmed: true,
    }
  } catch (error: any) {
    console.error("[v0] Server: Erro inesperado no login:", error?.message || error)
    return {
      success: false,
      error: "Erro ao fazer login. Tente novamente.",
    }
  }
}
