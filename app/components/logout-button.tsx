"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/login")
  }

  return (
    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-500 hover:text-red-600">
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  )
}
