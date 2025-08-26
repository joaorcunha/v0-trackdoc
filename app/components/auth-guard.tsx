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
    const checkAuth = () => {
      // Verificar se está na página de login
      if (pathname === "/login") {
        setIsLoading(false)
        return
      }

      // Verificar autenticação
      const authStatus = localStorage.getItem("isAuthenticated")

      if (authStatus === "true") {
        setIsAuthenticated(true)
      } else {
        // Redirecionar para login se não autenticado
        router.push("/login")
        return
      }

      setIsLoading(false)
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

  // Se estiver na página de login, mostrar sem verificação
  if (pathname === "/login") {
    return <>{children}</>
  }

  // Se autenticado, mostrar conteúdo
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Fallback (não deveria chegar aqui)
  return null
}
