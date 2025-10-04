"use server"

import { createClient } from "@/lib/supabase/server"

interface LoginData {
  email: string
  password: string
}

interface LoginResult {
  success: boolean
  error?: string
}

export async function loginUser(data: LoginData): Promise<LoginResult> {
  try {
    console.log("[v0] Server: Tentando login para:", data.email)

    const supabase = await createClient()

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      console.error("[v0] Server: Erro ao fazer login:", authError)
      return {
        success: false,
        error: "Email ou senha incorretos",
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Email ou senha incorretos",
      }
    }

    console.log("[v0] Server: Login realizado com sucesso para:", authData.user.email)

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("[v0] Server: Erro inesperado no login:", error)
    return {
      success: false,
      error: "Erro ao fazer login. Tente novamente.",
    }
  }
}
