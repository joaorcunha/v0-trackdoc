"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Mail } from "lucide-react"
import Link from "next/link"

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
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
                  Enviamos um link de confirmação para seu email. Clique no link para ativar sua conta e começar a usar
                  o sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
            <h3 className="font-semibold text-sm">O que você ganha:</h3>
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

          <Button asChild className="w-full">
            <Link href="/login">Ir para o login</Link>
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Não recebeu o email? <button className="font-medium text-primary hover:underline">Reenviar</button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
