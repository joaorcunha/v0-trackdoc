"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, Edit, Send, CheckCircle, Download, Eye, Clock } from "lucide-react"

interface AuditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document?: any
}

const mockAuditLog = [
  {
    id: 1,
    action: "created",
    user: "João Silva",
    timestamp: "2024-01-15 09:30:00",
    details: "Documento criado",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    id: 2,
    action: "edited",
    user: "João Silva",
    timestamp: "2024-01-15 14:20:00",
    details: "Conteúdo editado - Seção 3 atualizada",
    icon: Edit,
    color: "text-orange-600",
  },
  {
    id: 3,
    action: "sent_for_approval",
    user: "João Silva",
    timestamp: "2024-01-16 10:15:00",
    details: "Enviado para aprovação",
    icon: Send,
    color: "text-purple-600",
  },
  {
    id: 4,
    action: "approved",
    user: "Maria Santos",
    timestamp: "2024-01-17 11:45:00",
    details: "Aprovado por Maria Santos (Gerente de TI)",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 5,
    action: "viewed",
    user: "Carlos Oliveira",
    timestamp: "2024-01-18 08:30:00",
    details: "Documento visualizado",
    icon: Eye,
    color: "text-gray-600",
  },
  {
    id: 6,
    action: "downloaded",
    user: "Ana Costa",
    timestamp: "2024-01-19 16:20:00",
    details: "Download realizado",
    icon: Download,
    color: "text-indigo-600",
  },
  {
    id: 7,
    action: "version_created",
    user: "João Silva",
    timestamp: "2024-01-20 09:10:00",
    details: "Nova versão criada (v2.1)",
    icon: FileText,
    color: "text-blue-600",
  },
]

const actionLabels = {
  created: "Criado",
  edited: "Editado",
  sent_for_approval: "Enviado para Aprovação",
  approved: "Aprovado",
  rejected: "Rejeitado",
  viewed: "Visualizado",
  downloaded: "Download",
  version_created: "Nova Versão",
}

export default function AuditModal({ open, onOpenChange, document }: AuditModalProps) {
  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Auditoria do Documento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{document.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Número:</span> {document.number}
                </div>
                <div>
                  <span className="font-medium">Versão:</span> {document.version}
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge className="ml-2">
                    {document.status === "approved"
                      ? "Aprovado"
                      : document.status === "pending"
                        ? "Em Aprovação"
                        : "Rascunho"}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Autor:</span> {document.author}
                </div>
                <div>
                  <span className="font-medium">Setor:</span> {document.sector}
                </div>
                <div>
                  <span className="font-medium">Criado em:</span> {document.createdAt}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">Total de Ações</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Usuários Envolvidos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Versões</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Dias Ativos</p>
              </CardContent>
            </Card>
          </div>

          {/* Audit Log */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAuditLog.map((log, index) => {
                  const Icon = log.icon
                  return (
                    <div key={log.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                      <div className={`p-2 rounded-full bg-gray-100 ${log.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{actionLabels[log.action]}</Badge>
                            <span className="font-medium">{log.user}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(log.timestamp).toLocaleString("pt-BR")}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* User Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Atividade por Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">João Silva</p>
                      <p className="text-sm text-gray-500">Autor</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">4 ações</p>
                    <p className="text-sm text-gray-500">Última: há 1 dia</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Maria Santos</p>
                      <p className="text-sm text-gray-500">Aprovador</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">1 ação</p>
                    <p className="text-sm text-gray-500">Última: há 3 dias</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Ana Costa</p>
                      <p className="text-sm text-gray-500">Visualizador</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">1 ação</p>
                    <p className="text-sm text-gray-500">Última: há 2 dias</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
