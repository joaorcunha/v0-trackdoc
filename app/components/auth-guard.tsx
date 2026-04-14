"use client"

import type React from "react"

// MODO DE TESTES: Desabilita autenticação completamente
const TESTING_MODE = true

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  // Em modo de testes, renderiza diretamente sem nenhuma verificação
  if (TESTING_MODE) {
    return <>{children}</>
  }

  // Código de autenticação desabilitado durante testes
  return <>{children}</>
}
