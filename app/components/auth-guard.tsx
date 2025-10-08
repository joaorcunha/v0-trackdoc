"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    console.log("[v0] AuthGuard: Verificando autenticação para rota:", pathname)

    const checkAuth = () => {
      const publicRoutes = ["/login", "/signup", "/signup/success"]
      const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

      console.log("[v0] AuthGuard: É rota pública?", isPublicRoute)

      // Verificar se está em uma rota pública
      if (isPublicRoute) {
        console.log("[v0] AuthGuard: Rota pública, permitindo acesso")
        setIsLoading(false)
        return
      }

      // Verificar autenticação
      const authStatus = localStorage.getItem("isAuthenticated")
      console.log("[v0] AuthGuard: Status de autenticação no localStorage:", authStatus)

      if (authStatus === "true") {
        console.log("[v0] AuthGuard: Usuário autenticado, permitindo acesso")
        setIsAuthenticated(true)
        setIsLoading(false)
      } else {
        console.log("[v0] AuthGuard: Usuário não autenticado, redirecionando para login")
        setIsLoading(false)
        // Redirecionar para login se não autenticado
        router.push("/login")
      }
    }

    checkAuth()
  }, [pathname, router])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  const publicRoutes = ["/login", "/signup", "/signup/success"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (isPublicRoute) {
    return <>{children}</>
  }

  // Se autenticado, mostrar conteúdo
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Fallback (não deveria chegar aqui)
  return null
}
