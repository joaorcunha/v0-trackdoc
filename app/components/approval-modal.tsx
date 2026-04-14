"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Check, X, Clock, User, FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function ApprovalModal({ document, onApprove, onReject }) {
  const [comment, setComment] = useState("")
  const [showModal, setShowModal] = useState(false)

  const handleApprove = () => {
    onApprove(document.id, comment)
    setShowModal(false)
  }

  const handleReject = () => {
    onReject(document.id, comment)
    setShowModal(false)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 bg-transparent">
          Aprovar/Rejeitar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Revisar Documento para Aprovação</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold">{document.title}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Autor: {document.author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Data: {document.createdAt}</span>
            </div>
            <div className="flex items-center">
              <Badge variant="outline">{document.category}</Badge>
            </div>
            <div className="flex items-center">{getStatusBadge(document.status)}</div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Conteúdo do Documento (Prévia)</h4>
            <div className="border rounded-md p-3 h-40 overflow-y-auto bg-gray-50 text-sm text-gray-800">
              <p>{document.content.substring(0, 300)}...</p>
              {/* Em uma implementação real, você renderizaria o conteúdo completo ou um visualizador */}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comentário (Opcional)</Label>
            <Textarea
              id="comment"
              placeholder="Adicione um comentário sobre sua decisão..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button onClick={handleReject} className="bg-red-500 hover:bg-red-600">
            <X className="h-4 w-4 mr-2" />
            Rejeitar
          </Button>
          <Button onClick={handleApprove} className="bg-green-500 hover:bg-green-600">
            <Check className="h-4 w-4 mr-2" />
            Aprovar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
