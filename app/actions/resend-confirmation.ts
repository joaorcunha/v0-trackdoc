"use server"

import { createClient } from "@/lib/supabase/server"

interface ResendResult {
  success: boolean
  error?: string
}

export async function resendConfirmationEmail(email: string): Promise<ResendResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro ao reenviar email",
    }
  }
}
