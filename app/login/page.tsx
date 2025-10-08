"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const signupSuccess = searchParams.get("signup")
    const email = searchParams.get("email")

    if (signupSuccess === "success") {
      setSuccess("Conta criada com sucesso! Faça login para continuar.")
      if (email) {
        setFormData((prev) => ({ ...prev, email: decodeURIComponent(email) }))
      }
    }
  }, [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.email) {
      setError("Email é obrigatório")
      return false
    }
    if (!formData.email.includes("@")) {
      setError("Email inválido")
      return false
    }
    if (!formData.password) {
      setError("Senha é obrigatória")
      return false
    }
    if (formData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("[v0] Client: Tentando fazer login...")

      const supabase = createClient()

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        console.error("[v0] Client: Erro ao fazer login:", authError)
        setError("Email ou senha incorretos")
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setError("Email ou senha incorretos")
        setIsLoading(false)
        return
      }

      if (!authData.user.email_confirmed_at) {
        console.log("[v0] Client: Email não confirmado para:", authData.user.email)
        setError("Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.")
        setIsLoading(false)
        return
      }

      console.log("[v0] Client: Login realizado com sucesso para:", authData.user.email)
      console.log("[v0] Client: Sessão criada, redirecionando...")

      await new Promise((resolve) => setTimeout(resolve, 500))

      window.location.href = "/"
    } catch (err: any) {
      console.error("[v0] Client: Erro inesperado no login:", err)
      setError("Erro ao fazer login. Tente novamente.")
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    // Implementar lógica de recuperação de senha
    alert("Funcionalidade de recuperação de senha será implementada em breve.")
  }

  const handleSignupClick = () => {
    router.push("/signup")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8 py-0">
          <div className="flex justify-center mb-0.5">
            <Image
              src="/images/logo-trackdoc-horizontal.png"
              alt="Trackdoc"
              width={200}
              height={57}
              priority
              className="h-auto w-auto max-w-[200px]"
            />
          </div>
          <p className="text-gray-600">Gestão de Documentos</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Entrar na sua conta</CardTitle>
            <CardDescription className="text-center">Digite suas credenciais para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-11 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Opções */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Lembrar de mim
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-normal text-blue-600 hover:text-blue-700"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  Esqueci minha senha
                </Button>
              </div>

              {/* Mensagens de Erro/Sucesso */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              {/* Botão de Login */}
              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">Não tem uma conta?</p>
              <Button variant="outline" className="w-full bg-transparent" type="button" onClick={handleSignupClick}>
                Criar conta grátis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 TrackDoc. Todos os direitos reservados.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Button variant="link" className="px-0 text-gray-500 hover:text-gray-700">
              Termos de Uso
            </Button>
            <Button variant="link" className="px-0 text-gray-500 hover:text-gray-700">
              Política de Privacidade
            </Button>
            <Button variant="link" className="px-0 text-gray-500 hover:text-gray-700">
              Suporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
