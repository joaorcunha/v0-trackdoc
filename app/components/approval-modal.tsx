"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Clock, User } from "lucide-react"

interface ApprovalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document?: any
  onApprove: (decision: { approved: boolean; comment: string }) => void
}

const mockApprovalFlow = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Gerente de TI",
    status: "approved",
    comment: "Documento aprovado. Conteúdo está adequado às políticas.",
    date: "2024-01-19",
  },
  {
    id: 2,
    name: "Carlos Oliveira",
    role: "Diretor",
    status: "pending",
    comment: "",
    date: null,
  },
  {
    id: 3,
    name: "Ana Costa",
    role: "Compliance",
    status: "waiting",
    comment: "",
    date: null,
  },
]

export default function ApprovalModal({ open, onOpenChange, document, onApprove }: ApprovalModalProps) {
  const [comment, setComment] = useState("")

  const handleApproval = (approved: boolean) => {
    onApprove({ approved, comment })
    setComment("")
  }

  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Aprovação de Documento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{document.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Número:</span> {document.number}
                </div>
                <div>
                  <span className="font-medium">Versão:</span> {document.version}
                </div>
                <div>
                  <span className="font-medium">Autor:</span> {document.author}
                </div>
                <div>
                  <span className="font-medium">Setor:</span> {document.sector}
                </div>
                <div>
                  <span className="font-medium">Tipo:</span> {document.type}
                </div>
                <div>
                  <span className="font-medium">Data:</span> {document.createdAt}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApprovalFlow.map((approver, index) => (
                  <div key={approver.id} className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=${approver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`}
                      />
                      <AvatarFallback>
                        {approver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{approver.name}</span>
                        <span className="text-sm text-gray-500">({approver.role})</span>
                        {approver.status === "approved" && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Aprovado
                          </Badge>
                        )}
                        {approver.status === "pending" && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pendente
                          </Badge>
                        )}
                        {approver.status === "waiting" && (
                          <Badge variant="secondary">
                            <User className="h-3 w-3 mr-1" />
                            Aguardando
                          </Badge>
                        )}
                      </div>
                      {approver.comment && <p className="text-sm text-gray-600 mt-1">{approver.comment}</p>}
                      {approver.date && <p className="text-xs text-gray-500 mt-1">Em {approver.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Approval Decision */}
          <Card>
            <CardHeader>
              <CardTitle>Sua Decisão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment">Comentário</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Adicione um comentário sobre sua decisão..."
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleApproval(true)} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
                <Button onClick={() => handleApproval(false)} variant="destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
