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
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
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
      return {
        success: false,
        error: "Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.",
        emailConfirmed: false,
      }
    }

    return {
      success: true,
      emailConfirmed: true,
    }
  } catch (error: any) {
    return {
      success: false,
      error: "Erro ao fazer login. Tente novamente.",
    }
  }
}
