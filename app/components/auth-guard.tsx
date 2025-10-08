"use client"

import type React from "react"
import { usePathname } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname()

  // O middleware já cuida disso, então apenas renderizamos o conteúdo
  const publicRoutes = ["/login", "/signup", "/signup/success"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Para rotas públicas, renderizar diretamente
  if (isPublicRoute) {
    return <>{children}</>
  }

  // Para rotas protegidas, o middleware já verificou a autenticação
  // Se chegou aqui, o usuário está autenticado
  return <>{children}</>
}
