"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Mail, Lock, User, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (!formData.companyName.trim()) {
      setError("O nome da empresa é obrigatório")
      setIsLoading(false)
      return
    }

    if (!formData.fullName.trim()) {
      setError("Seu nome completo é obrigatório")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
          },
        },
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error("Erro ao criar usuário")
      }

      // Step 2: Create company and admin profile using RPC function
      const { data: companyData, error: companyError } = await supabase.rpc("create_company_with_admin", {
        p_company_name: formData.companyName,
        p_user_id: authData.user.id,
        p_user_email: formData.email,
        p_user_full_name: formData.fullName,
      })

      if (companyError) throw companyError

      if (!companyData.success) {
        throw new Error(companyData.error || "Erro ao criar empresa")
      }

      // Success! Redirect to confirmation page
      router.push("/signup/success")
    } catch (err: any) {
      console.error("Erro no cadastro:", err)
      setError(err.message || "Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-lg">
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
          <CardTitle className="text-2xl font-bold">Crie sua conta</CardTitle>
          <CardDescription>Comece seu período de teste gratuito de 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Minha Empresa Ltda"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="pl-9"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="João Silva"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-9"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="joao@empresa.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-9"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-9"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta e iniciar teste grátis"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Fazer login
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground">
              Ao criar uma conta, você concorda com nossos{" "}
              <Link href="/terms" className="underline">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link href="/privacy" className="underline">
                Política de Privacidade
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
