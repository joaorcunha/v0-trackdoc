"use client"

import { useState } from "react"
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

const mockAuditData = [
  {
    id: 1,
    action: "document_created",
    user: "João Silva",
    details: "Criou o documento 'Manual de Procedimentos Operacionais'",
    document: "DOC-2024-001",
    documentTitle: "Manual de Procedimentos Operacionais",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severity: "info",
    ipAddress: "192.168.1.45",
    userAgent: "Chrome 120.0",
  },
  {
    id: 2,
    action: "document_approved",
    user: "Maria Santos",
    details: "Aprovou o documento 'Política de Segurança da Informação'",
    document: "DOC-2024-015",
    documentTitle: "Política de Segurança da Informação",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    severity: "success",
    ipAddress: "192.168.1.67",
    userAgent: "Firefox 121.0",
  },
  {
    id: 3,
    action: "login_failed",
    user: "carlos.oliveira@empresa.com",
    details: "Tentativa de login falhou - senha incorreta",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    severity: "warning",
    ipAddress: "192.168.1.89",
    userAgent: "Safari 17.2",
  },
  {
    id: 4,
    action: "document_viewed",
    user: "Ana Costa",
    details: "Visualizou o documento 'Relatório Financeiro Q4 2023'",
    document: "DOC-2024-008",
    documentTitle: "Relatório Financeiro Q4 2023",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    severity: "info",
    ipAddress: "192.168.1.23",
    userAgent: "Chrome 120.0",
  },
  {
    id: 5,
    action: "document_deleted",
    user: "Pedro Lima",
    details: "Excluiu o documento 'Rascunho - Política Antiga'",
    document: "DOC-2023-089",
    documentTitle: "Rascunho - Política Antiga",
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    severity: "critical",
    ipAddress: "192.168.1.56",
    userAgent: "Edge 120.0",
  },
  {
    id: 6,
    action: "user_permissions_changed",
    user: "Roberto Silva",
    details: "Alterou permissões do usuário 'Lucia Ferreira' para Administrador",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    severity: "warning",
    ipAddress: "192.168.1.12",
    userAgent: "Chrome 120.0",
  },
  {
    id: 7,
    action: "document_edited",
    user: "Fernanda Costa",
    details: "Editou o documento 'Guia de Integração de Novos Funcionários'",
    document: "DOC-2024-022",
    documentTitle: "Guia de Integração de Novos Funcionários",
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    severity: "info",
    ipAddress: "192.168.1.78",
    userAgent: "Chrome 120.0",
  },
  {
    id: 8,
    action: "document_rejected",
    user: "Marcos Oliveira",
    details: "Rejeitou o documento 'Proposta de Orçamento 2024' - necessita revisão",
    document: "DOC-2024-034",
    documentTitle: "Proposta de Orçamento 2024",
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    severity: "warning",
    ipAddress: "192.168.1.34",
    userAgent: "Firefox 121.0",
  },
  {
    id: 9,
    action: "login_success",
    user: "Sandra Lima",
    details: "Login realizado com sucesso",
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    severity: "success",
    ipAddress: "192.168.1.90",
    userAgent: "Chrome 120.0",
  },
  {
    id: 10,
    action: "document_created",
    user: "Paulo Santos",
    details: "Criou o documento 'Procedimentos de Qualidade ISO 9001'",
    document: "DOC-2024-011",
    documentTitle: "Procedimentos de Qualidade ISO 9001",
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    severity: "info",
    ipAddress: "192.168.1.45",
    userAgent: "Safari 17.2",
  },
  {
    id: 11,
    action: "system_backup",
    user: "Sistema",
    details: "Backup automático do sistema realizado com sucesso",
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    severity: "success",
    ipAddress: "127.0.0.1",
    userAgent: "System",
  },
  {
    id: 12,
    action: "document_approved",
    user: "Carla Mendes",
    details: "Aprovou o documento 'Manual de Procedimentos Operacionais'",
    document: "DOC-2024-001",
    documentTitle: "Manual de Procedimentos Operacionais",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    severity: "success",
    ipAddress: "192.168.1.56",
    userAgent: "Chrome 120.0",
  },
  {
    id: 13,
    action: "user_created",
    user: "Roberto Silva",
    details: "Criou novo usuário 'Beatriz Silva' no departamento de Qualidade",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    severity: "info",
    ipAddress: "192.168.1.12",
    userAgent: "Chrome 120.0",
  },
  {
    id: 14,
    action: "document_viewed",
    user: "Juliana Rocha",
    details: "Visualizou o documento 'Política de Segurança da Informação'",
    document: "DOC-2024-015",
    documentTitle: "Política de Segurança da Informação",
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    severity: "info",
    ipAddress: "192.168.1.67",
    userAgent: "Firefox 121.0",
  },
  {
    id: 15,
    action: "login_failed",
    user: "ricardo.alves@empresa.com",
    details: "Tentativa de login falhou - conta bloqueada após múltiplas tentativas",
    timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    severity: "critical",
    ipAddress: "192.168.1.99",
    userAgent: "Chrome 120.0",
  },
]

const actionLabels = {
  document_created: "Documento Criado",
  document_edited: "Documento Editado",
  document_viewed: "Documento Visualizado",
  document_approved: "Documento Aprovado",
  document_rejected: "Documento Rejeitado",
  document_deleted: "Documento Excluído",
  login_success: "Login Realizado",
  login_failed: "Falha no Login",
  user_created: "Usuário Criado",
  user_permissions_changed: "Permissões Alteradas",
  system_backup: "Backup do Sistema",
}

const actionIcons = {
  document_created: <FileText className="h-4 w-4" />,
  document_edited: <Edit className="h-4 w-4" />,
  document_viewed: <Eye className="h-4 w-4" />,
  document_approved: <CheckCircle className="h-4 w-4" />,
  document_rejected: <XCircle className="h-4 w-4" />,
  document_deleted: <FileText className="h-4 w-4" />,
  login_success: <User className="h-4 w-4" />,
  login_failed: <User className="h-4 w-4" />,
  user_created: <User className="h-4 w-4" />,
  user_permissions_changed: <Shield className="h-4 w-4" />,
  system_backup: <Activity className="h-4 w-4" />,
}

const severityColors = {
  info: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  critical: "bg-red-100 text-red-800",
}

const severityLabels = {
  info: "Info",
  success: "Sucesso",
  warning: "Atenção",
  critical: "Crítico",
}

export default function AuditReport() {
  const [auditLogs, setAuditLogs] = useState(mockAuditData) // Initialize with mock data
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedUser, setSelectedUser] = useState("all")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.documentTitle && log.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesAction = selectedAction === "all" || log.action === selectedAction
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity
    const matchesUser = selectedUser === "all" || log.user === selectedUser

    return matchesSearch && matchesAction && matchesSeverity && matchesUser
  })

  const stats = {
    total: auditLogs.length,
    today: auditLogs.filter((log) => log.timestamp?.startsWith(new Date().toISOString().slice(0, 10))).length,
    critical: auditLogs.filter((log) => log.severity === "critical").length,
    warnings: auditLogs.filter((log) => log.severity === "warning").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">Atividade do dia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Críticos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.critical}</div>
            <p className="text-xs text-red-600">Requer atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avisos</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.warnings}</div>
            <p className="text-xs text-yellow-600">Para revisão</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar nos logs de auditoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Ações</SelectItem>
                  <SelectItem value="document_created">Documento Criado</SelectItem>
                  <SelectItem value="document_approved">Documento Aprovado</SelectItem>
                  <SelectItem value="document_viewed">Documento Visualizado</SelectItem>
                  <SelectItem value="login_failed">Falha no Login</SelectItem>
                  <SelectItem value="document_deleted">Documento Excluído</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="warning">Atenção</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Usuários</SelectItem>
                  <SelectItem value="João Silva">João Silva</SelectItem>
                  <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                  <SelectItem value="Carlos Oliveira">Carlos Oliveira</SelectItem>
                  <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                  <SelectItem value="Pedro Lima">Pedro Lima</SelectItem>
                  <SelectItem value="Roberto Silva">Roberto Silva</SelectItem>
                  <SelectItem value="Fernanda Costa">Fernanda Costa</SelectItem>
                  <SelectItem value="Marcos Oliveira">Marcos Oliveira</SelectItem>
                  <SelectItem value="Sandra Lima">Sandra Lima</SelectItem>
                  <SelectItem value="Paulo Santos">Paulo Santos</SelectItem>
                  <SelectItem value="Carla Mendes">Carla Mendes</SelectItem>
                  <SelectItem value="Juliana Rocha">Juliana Rocha</SelectItem>
                  <SelectItem value="ricardo.alves@empresa.com">ricardo.alves@empresa.com</SelectItem>
                </SelectContent>
              </Select>

              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Logs de Auditoria ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <p className="text-center text-gray-500">Nenhum log de auditoria disponível.</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className={`p-2 rounded-full ${severityColors[log.severity]}`}>
                    {actionIcons[log.action] || <Activity className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{actionLabels[log.action] || log.action}</h3>
                        <Badge className={severityColors[log.severity]}>{severityLabels[log.severity]}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(log.timestamp).toLocaleString("pt-BR")}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">{log.details}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {log.user}
                        </span>
                        {log.document && (
                          <span className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {log.document} - {log.documentTitle}
                          </span>
                        )}
                        <span>IP: {log.ipAddress}</span>
                        <span>{log.userAgent}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
