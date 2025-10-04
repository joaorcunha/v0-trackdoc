"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { resendConfirmationEmail } from "@/app/actions/resend-confirmation"

export default function SignupSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  const handleResend = async () => {
    if (!email) return

    setIsResending(true)
    setResendError(null)
    setResendSuccess(false)

    try {
      const result = await resendConfirmationEmail(email)

      if (!result.success) {
        throw new Error(result.error || "Erro ao reenviar email")
      }

      setResendSuccess(true)
    } catch (error: any) {
      setResendError(error.message || "Erro ao reenviar email")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <Image
              src="/images/logo-trackdoc-horizontal.png"
              alt="Trackdoc"
              width={200}
              height={57}
              priority
              className="h-auto w-auto max-w-[200px]"
            />
          </div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Conta criada com sucesso!</CardTitle>
          <CardDescription>Verifique seu email para confirmar sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-blue-900">Confirme seu email</p>
                <p className="text-sm text-blue-700">
                  Enviamos um link de confirmação para <strong>{email}</strong>. Clique no link para ativar sua conta e
                  começar a usar o sistema.
                </p>
              </div>
            </div>
          </div>

          {resendSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">Email reenviado com sucesso!</AlertDescription>
            </Alert>
          )}

          {resendError && (
            <Alert variant="destructive">
              <AlertDescription>{resendError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
            <h3 className="text-sm font-semibold">O que você ganha:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />7 dias de teste grátis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Até 5 usuários
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                10GB de armazenamento
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Todos os recursos disponíveis
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">Ir para o login</Link>
            </Button>

            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleResend}
              disabled={isResending || !email}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reenviando...
                </>
              ) : (
                "Reenviar email de confirmação"
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Não recebeu o email? Verifique sua caixa de spam ou clique em reenviar acima.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
