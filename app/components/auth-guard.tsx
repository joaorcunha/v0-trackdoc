"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // In a real application, you would validate a token or session
    const authStatus = localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(authStatus)
    setIsLoading(false)

    if (!authStatus) {
      router.push("/login")
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
        <p>Carregando...</p>
      </div>
    )
  }

  return isAuthenticated ? children : null
}
