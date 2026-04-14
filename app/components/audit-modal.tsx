"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { History, User, Clock, FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function AuditModal({ document }) {
  const [showModal, setShowModal] = useState(false)

  const mockAuditLog = [
    {
      id: 1,
      action: "Criação do Documento",
      user: "João Silva",
      timestamp: "2023-10-26 10:00",
      details: "Documento inicial criado.",
    },
    {
      id: 2,
      action: "Edição de Conteúdo",
      user: "Maria Santos",
      timestamp: "2023-10-26 11:30",
      details: "Conteúdo principal atualizado.",
    },
    {
      id: 3,
      action: "Solicitação de Aprovação",
      user: "João Silva",
      timestamp: "2023-10-26 14:00",
      details: "Documento enviado para aprovação.",
    },
    {
      id: 4,
      action: "Aprovação",
      user: "Carlos Oliveira",
      timestamp: "2023-10-27 09:15",
      details: "Documento aprovado pelo gerente.",
    },
    {
      id: 5,
      action: "Publicação",
      user: "Admin",
      timestamp: "2023-10-27 10:00",
      details: "Documento publicado e disponível.",
    },
  ]

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 bg-transparent">
          <History className="h-4 w-4 mr-2" />
          Auditoria
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Auditoria do Documento</DialogTitle>
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
              <span>Data de Criação: {document.createdAt}</span>
            </div>
            <div className="flex items-center">
              <Badge variant="outline">{document.category}</Badge>
            </div>
            <div className="flex items-center">
              <Badge className="bg-blue-100 text-blue-800">Status: {document.status}</Badge>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Log de Atividades</h4>
            <div className="space-y-4">
              {mockAuditLog.map((log) => (
                <div key={log.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <History className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-gray-700">{log.details}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <User className="h-3 w-3 mr-1" />
                      <span>{log.user}</span>
                      <Clock className="h-3 w-3 ml-3 mr-1" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
