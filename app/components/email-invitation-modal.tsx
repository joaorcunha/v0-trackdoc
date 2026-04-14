"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"

export default function EmailInvitationModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("") // 'success' or 'error'

  const handleSendInvitation = (e) => {
    e.preventDefault()
    setStatus("")
    setMessage("")

    if (!email || !role) {
      setStatus("error")
      setMessage("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    // Simulate API call
    setTimeout(() => {
      if (email.includes("@")) {
        setStatus("success")
        setMessage(`Convite enviado para ${email} com o papel de ${role}.`)
        setEmail("")
        setRole("viewer")
      } else {
        setStatus("error")
        setMessage("Endereço de e-mail inválido.")
      }
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convidar Usuário por Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSendInvitation} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email do Convidado</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Papel</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione um papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Visualizador</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {status && <p className={`text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}>{message}</p>}
          <Button type="submit" className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Enviar Convite
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
