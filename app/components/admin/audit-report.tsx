"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  FileText,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Activity,
  Shield,
} from "lucide-react"
import { getAuditLogs } from "@/app/admin/actions"

const actionLabels: Record<string, string> = {
  document_created: "Documento Criado",
  document_updated: "Documento Atualizado",
  document_approved: "Documento Aprovado",
  document_rejected: "Documento Rejeitado",
  document_viewed: "Documento Visualizado",
  document_downloaded: "Download Realizado",
  document_deleted: "Documento Excluído",
  login: "Login Realizado",
  login_failed: "Falha no Login",
  logout: "Logout",
  user_created: "Usuário Criado",
  user_updated: "Usuário Atualizado",
  user_permissions_changed: "Permissões Alteradas",
}

const severityColors: Record<string, string> = {
  info: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  critical: "bg-red-100 text-red-800",
}

const getSeverityFromAction = (action: string): string => {
  if (action.includes("deleted") || action.includes("failed")) return "critical"
  if (action.includes("approved") || action.includes("created")) return "success"
  if (action.includes("permissions") || action.includes("rejected")) return "warning"
  return "info"
}

const getIconFromAction = (action: string) => {
  if (action.includes("created")) return FileText
  if (action.includes("approved")) return CheckCircle
  if (action.includes("rejected") || action.includes("deleted")) return XCircle
  if (action.includes("updated") || action.includes("edited")) return Edit
  if (action.includes("viewed")) return Eye
  if (action.includes("login") || action.includes("logout")) return User
  if (action.includes("permissions")) return Shield
  return Activity
}

export default function AuditReport() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [auditData, setAuditData] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAuditLogs(100)
      setAuditData(data.map((log: any) => ({
        id: log.id,
        action: log.action,
        user: log.user?.full_name || log.user?.email || "Sistema",
        details: log.details || "",
        document: log.entity_type === "document" ? log.entity_id : null,
        timestamp: log.created_at,
        severity: getSeverityFromAction(log.action),
        ipAddress: log.ip_address || "-",
        userAgent: log.user_agent || "-",
      })))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredData = auditData.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = selectedAction === "all" || log.action === selectedAction
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity
    return matchesSearch && matchesAction && matchesSeverity
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR")
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditData.length}</div>
            <p className="text-xs text-muted-foreground">Últimos 100 eventos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criações</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditData.filter((a) => a.action.includes("created")).length}
            </div>
            <p className="text-xs text-muted-foreground">Documentos criados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovações</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditData.filter((a) => a.action.includes("approved")).length}
            </div>
            <p className="text-xs text-muted-foreground">Documentos aprovados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditData.filter((a) => a.severity === "critical" || a.severity === "warning").length}
            </div>
            <p className="text-xs text-muted-foreground">Eventos críticos/alerta</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por usuário ou detalhes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Ações</SelectItem>
                  <SelectItem value="document_created">Criação</SelectItem>
                  <SelectItem value="document_approved">Aprovação</SelectItem>
                  <SelectItem value="document_viewed">Visualização</SelectItem>
                  <SelectItem value="document_updated">Edição</SelectItem>
                  <SelectItem value="document_deleted">Exclusão</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="info">Informativo</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="warning">Alerta</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar Log
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle>Log de Auditoria</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum registro de auditoria encontrado.</p>
          ) : (
            <div className="space-y-4">
              {filteredData.map((log) => {
                const Icon = getIconFromAction(log.action)
                return (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="mt-1">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{log.user}</span>
                        <Badge className={severityColors[log.severity]}>
                          {actionLabels[log.action] || log.action}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(log.timestamp)}
                        </span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
