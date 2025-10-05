"use client"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignupSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

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
          <CardDescription>Sua conta está pronta para uso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-green-900">Conta ativada</p>
                <p className="text-sm text-green-700">
                  Sua conta <strong>{email}</strong> foi criada e ativada com sucesso. Você já pode fazer login e
                  começar a usar o sistema.
                </p>
              </div>
            </div>
          </div>

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
              <Link href="/login">Fazer login agora</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
