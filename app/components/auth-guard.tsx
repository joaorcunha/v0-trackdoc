"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
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
    const checkAuth = async () => {
      const publicRoutes = ["/login", "/signup", "/signup/success"]
      const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

      // Se é rota pública, não precisa verificar autenticação
      if (isPublicRoute) {
        setIsLoading(false)
        setIsAuthenticated(true)
        return
      }

      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          setIsAuthenticated(false)
          setIsLoading(false)
          router.push("/login")
          return
        }

        setIsAuthenticated(true)
        setIsLoading(false)
      } catch (err) {
        setIsAuthenticated(false)
        setIsLoading(false)
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

  // Se autenticado ou em rota pública, mostrar conteúdo
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Fallback (não deveria chegar aqui)
  return null
}
