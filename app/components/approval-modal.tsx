"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Clock, User } from "lucide-react"
import { getDocumentApprovalFlow } from "@/app/admin/actions"

interface ApprovalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document?: any
  onApprove: (decision: { approved: boolean; comment: string }) => void
}

export default function ApprovalModal({ open, onOpenChange, document, onApprove }: ApprovalModalProps) {
  const [comment, setComment] = useState("")
  const [approvalFlow, setApprovalFlow] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchApprovalFlow = useCallback(async () => {
    if (!document?.id) return
    setIsLoading(true)
    try {
      const data = await getDocumentApprovalFlow(String(document.id))
      setApprovalFlow(data.map((a: any) => ({
        id: a.id,
        name: a.approver?.full_name || "Aprovador",
        role: "Aprovador",
        status: a.status,
        comment: a.comment || "",
        date: a.approved_at?.split("T")[0] || null,
      })))
    } finally {
      setIsLoading(false)
    }
  }, [document?.id])

  useEffect(() => {
    if (open && document?.id) {
      fetchApprovalFlow()
    }
  }, [open, document?.id, fetchApprovalFlow])

  const handleApproval = (approved: boolean) => {
    onApprove({ approved, comment })
    setComment("")
  }

  if (!document) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      default:
        return <Badge variant="secondary">Aguardando</Badge>
    }
  }

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
                  <span className="font-medium">Tipo:</span> {document.type || "-"}
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
              {isLoading ? (
                <p className="text-center text-muted-foreground py-4">Carregando...</p>
              ) : approvalFlow.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum fluxo de aprovação configurado para este documento.
                </p>
              ) : (
                <div className="space-y-4">
                  {approvalFlow.map((approver, index) => (
                    <div
                      key={approver.id}
                      className="flex items-start space-x-4 p-3 border rounded-lg"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {approver.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{approver.name}</p>
                            <p className="text-sm text-muted-foreground">{approver.role}</p>
                          </div>
                          {getStatusBadge(approver.status)}
                        </div>
                        {approver.comment && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            &quot;{approver.comment}&quot;
                          </p>
                        )}
                        {approver.date && (
                          <p className="text-xs text-muted-foreground mt-1">{approver.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approval Action */}
          <Card>
            <CardHeader>
              <CardTitle>Sua Decisão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment">Comentário (opcional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Adicione um comentário sobre sua decisão..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleApproval(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApproval(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
