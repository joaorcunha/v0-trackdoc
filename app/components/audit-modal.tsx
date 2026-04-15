"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, Edit, Send, CheckCircle, Download, Eye, Clock, XCircle } from "lucide-react"
import { getDocumentAuditLog } from "@/app/admin/actions"

interface AuditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document?: any
}

const actionLabels: Record<string, string> = {
  document_created: "Criado",
  document_updated: "Editado",
  document_sent_for_approval: "Enviado para Aprovação",
  document_approved: "Aprovado",
  document_rejected: "Rejeitado",
  document_viewed: "Visualizado",
  document_downloaded: "Download",
  document_version_created: "Nova Versão",
}

const getActionIcon = (action: string) => {
  if (action.includes("created") || action.includes("version")) return FileText
  if (action.includes("updated") || action.includes("edited")) return Edit
  if (action.includes("sent") || action.includes("approval")) return Send
  if (action.includes("approved")) return CheckCircle
  if (action.includes("rejected")) return XCircle
  if (action.includes("viewed")) return Eye
  if (action.includes("downloaded")) return Download
  return Clock
}

const getActionColor = (action: string) => {
  if (action.includes("approved")) return "text-green-600"
  if (action.includes("rejected")) return "text-red-600"
  if (action.includes("created") || action.includes("version")) return "text-blue-600"
  if (action.includes("updated") || action.includes("edited")) return "text-orange-600"
  if (action.includes("sent")) return "text-purple-600"
  if (action.includes("downloaded")) return "text-indigo-600"
  return "text-muted-foreground"
}

export default function AuditModal({ open, onOpenChange, document }: AuditModalProps) {
  const [auditLog, setAuditLog] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchAuditLog = useCallback(async () => {
    if (!document?.id) return
    setIsLoading(true)
    try {
      const data = await getDocumentAuditLog(String(document.id))
      setAuditLog(data.map((log: any) => ({
        id: log.id,
        action: log.action,
        user: log.user?.full_name || "Sistema",
        timestamp: log.created_at,
        details: log.details || "",
        icon: getActionIcon(log.action),
        color: getActionColor(log.action),
      })))
    } finally {
      setIsLoading(false)
    }
  }, [document?.id])

  useEffect(() => {
    if (open && document?.id) {
      fetchAuditLog()
    }
  }, [open, document?.id, fetchAuditLog])

  if (!document) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Auditoria do Documento</DialogTitle>
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
              </div>
            </CardContent>
          </Card>

          {/* Audit Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Alterações</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : auditLog.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum registro de auditoria encontrado para este documento.
                </p>
              ) : (
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-6">
                    {auditLog.map((log, index) => {
                      const Icon = log.icon
                      return (
                        <div key={log.id} className="relative flex items-start space-x-4">
                          <div
                            className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 ${log.color.replace(
                              "text-",
                              "border-"
                            )}`}
                          >
                            <Icon className={`h-5 w-5 ${log.color}`} />
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                  {actionLabels[log.action] || log.action}
                                </Badge>
                                <span className="text-sm text-muted-foreground">por</span>
                                <span className="font-medium">{log.user}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(log.timestamp)}
                              </span>
                            </div>
                            {log.details && (
                              <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
