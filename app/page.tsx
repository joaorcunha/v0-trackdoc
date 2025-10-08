"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  Building2,
  FileSpreadsheet,
  Presentation,
  File,
  Send,
  GitBranch,
  Tag,
  ChevronLeft,
  DollarSign,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import Sidebar from "./components/sidebar"
import DocumentModal from "./components/document-modal"
import DocumentPreviewModal from "./components/document-preview-modal"
import ApprovalModal from "./components/approval-modal"
import AuditModal from "./components/audit-modal"
import UserManagement from "./components/admin/user-management"
import WorkflowManagement from "./components/admin/workflow-management"
import DocumentTypeManagement from "./components/admin/document-type-management"
import ProductivityReport from "./components/admin/productivity-report"
import ApprovalTimeReport from "./components/admin/approval-time-report"
import AuditReport from "./components/admin/audit-report"
import DepartmentManagement from "./components/admin/department-management"
import CategoryManagement from "./components/admin/category-management"
import BillingManagement from "./components/admin/billing-management"
import NotificationManagement from "./components/admin/notification-management"
import HelpCenter from "./components/help-center"
import AIDocumentCreator from "./components/ai-document-creator"
import DocumentAccessReport from "./components/admin/document-access-report"
import DocumentCreationSelector from "./components/document-creation-selector"
import DocumentEditor from "./components/document-editor" // Imported DocumentEditor

const mockDocuments = [
  {
    id: 1,
    title: "Política de Segurança da Informação",
    number: "POL-TI-001",
    version: "2.0",
    author: "Carlos Silva",
    sector: "TI",
    status: "approved",
    fileType: "pdf",
    fileName: "politica_seguranca_v2.pdf",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
    approvals: 3,
    totalApprovals: 3,
  },
  {
    id: 2,
    title: "Procedimento de Onboarding",
    number: "PROC-RH-012",
    version: "1.5",
    author: "Ana Santos",
    sector: "RH",
    status: "approved",
    fileType: "word",
    fileName: "onboarding_procedimento.docx",
    createdAt: "2024-02-20",
    updatedAt: "2024-03-15",
    approvals: 2,
    totalApprovals: 2,
  },
  {
    id: 3,
    title: "Manual de Vendas - Q1 2024",
    number: "MAN-VEN-008",
    version: "3.2",
    author: "Roberto Lima",
    sector: "Vendas",
    status: "pending",
    fileType: "powerpoint",
    fileName: "manual_vendas_q1.pptx",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-20",
    approvals: 1,
    totalApprovals: 2,
  },
  {
    id: 4,
    title: "Relatório Financeiro Anual 2023",
    number: "REL-FIN-045",
    version: "1.0",
    author: "Mariana Costa",
    sector: "Financeiro",
    status: "approved",
    fileType: "excel",
    fileName: "relatorio_financeiro_2023.xlsx",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-30",
    approvals: 3,
    totalApprovals: 3,
  },
  {
    id: 5,
    title: "Política de Trabalho Remoto",
    number: "POL-RH-023",
    version: "1.0",
    author: "Ana Santos",
    sector: "RH",
    status: "draft",
    fileType: "word",
    fileName: "politica_trabalho_remoto.docx",
    createdAt: "2024-03-18",
    updatedAt: "2024-03-22",
    approvals: 0,
    totalApprovals: 2,
  },
  {
    id: 6,
    title: "Ata de Reunião - Diretoria Março",
    number: "ATA-DIR-015",
    version: "1.0",
    author: "Fernando Oliveira",
    sector: "Diretoria",
    status: "approved",
    fileType: "pdf",
    fileName: "ata_diretoria_marco.pdf",
    createdAt: "2024-03-05",
    updatedAt: "2024-03-08",
    approvals: 4,
    totalApprovals: 4,
  },
  {
    id: 7,
    title: "Procedimento de Backup de Dados",
    number: "PROC-TI-034",
    version: "2.1",
    author: "Carlos Silva",
    sector: "TI",
    status: "pending",
    fileType: "pdf",
    fileName: "procedimento_backup.pdf",
    createdAt: "2024-03-10",
    updatedAt: "2024-03-21",
    approvals: 2,
    totalApprovals: 3,
  },
  {
    id: 8,
    title: "Plano de Metas - Vendas 2024",
    number: "PLAN-VEN-019",
    version: "1.0",
    author: "Roberto Lima",
    sector: "Vendas",
    status: "approved",
    fileType: "powerpoint",
    fileName: "plano_metas_2024.pptx",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-25",
    approvals: 2,
    totalApprovals: 2,
  },
  {
    id: 9,
    title: "Política de Férias e Licenças",
    number: "POL-RH-018",
    version: "3.0",
    author: "Ana Santos",
    sector: "RH",
    status: "approved",
    fileType: "word",
    fileName: "politica_ferias.docx",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-15",
    approvals: 2,
    totalApprovals: 2,
  },
  {
    id: 10,
    title: "Orçamento Anual 2024",
    number: "ORC-FIN-002",
    version: "1.2",
    author: "Mariana Costa",
    sector: "Financeiro",
    status: "draft",
    fileType: "excel",
    fileName: "orcamento_2024.xlsx",
    createdAt: "2024-03-15",
    updatedAt: "2024-03-23",
    approvals: 0,
    totalApprovals: 3,
  },
  {
    id: 11,
    title: "Manual de Boas Práticas de TI",
    number: "MAN-TI-007",
    version: "1.8",
    author: "Carlos Silva",
    sector: "TI",
    status: "approved",
    fileType: "pdf",
    fileName: "manual_boas_praticas.pdf",
    createdAt: "2024-02-10",
    updatedAt: "2024-03-05",
    approvals: 3,
    totalApprovals: 3,
  },
  {
    id: 12,
    title: "Estratégia Comercial Q2 2024",
    number: "EST-VEN-011",
    version: "1.0",
    author: "Roberto Lima",
    sector: "Vendas",
    status: "pending",
    fileType: "powerpoint",
    fileName: "estrategia_q2.pptx",
    createdAt: "2024-03-20",
    updatedAt: "2024-03-24",
    approvals: 0,
    totalApprovals: 2,
  },
]

const monthlyEvolutionData = [
  { month: "Set", TI: 12, Vendas: 8, RH: 6, Financeiro: 4, Diretoria: 3 },
  { month: "Out", TI: 15, Vendas: 10, RH: 8, Financeiro: 5, Diretoria: 4 },
  { month: "Nov", TI: 18, Vendas: 12, RH: 9, Financeiro: 6, Diretoria: 5 },
  { month: "Dez", TI: 14, Vendas: 9, RH: 7, Financeiro: 8, Diretoria: 6 },
  { month: "Jan", TI: 20, Vendas: 15, RH: 10, Financeiro: 7, Diretoria: 5 },
  { month: "Fev", TI: 22, Vendas: 18, RH: 12, Financeiro: 9, Diretoria: 7 },
  { month: "Mar", TI: 25, Vendas: 20, RH: 14, Financeiro: 10, Diretoria: 8 },
]

const recentActivity = [
  {
    id: 1,
    action: "Documento aprovado",
    document: "Política de Segurança da Informação",
    user: "Carlos Silva",
    time: "Há 2 horas",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 2,
    action: "Novo documento criado",
    document: "Estratégia Comercial Q2 2024",
    user: "Roberto Lima",
    time: "Há 4 horas",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    id: 3,
    action: "Documento enviado para aprovação",
    document: "Procedimento de Backup de Dados",
    user: "Carlos Silva",
    time: "Há 6 horas",
    icon: Clock,
    color: "text-yellow-600",
  },
  {
    id: 4,
    action: "Documento editado",
    document: "Orçamento Anual 2024",
    user: "Mariana Costa",
    time: "Há 8 horas",
    icon: Edit,
    color: "text-gray-600",
  },
  {
    id: 5,
    action: "Documento aprovado",
    document: "Plano de Metas - Vendas 2024",
    user: "Roberto Lima",
    time: "Há 1 dia",
    icon: CheckCircle,
    color: "text-green-600",
  },
]

const sectorDistribution = [
  { sector: "TI", count: 25, percentage: 31, color: "#3b82f6" },
  { sector: "Vendas", count: 20, percentage: 25, color: "#10b981" },
  { sector: "RH", count: 14, percentage: 17, color: "#f59e0b" },
  { sector: "Financeiro", count: 10, percentage: 12, color: "#8b5cf6" },
  { sector: "Diretoria", count: 8, percentage: 10, color: "#ef4444" },
  { sector: "Outros", count: 4, percentage: 5, color: "#6b7280" },
]

// Função para obter ícone do formato do arquivo
const getFileTypeIcon = (fileType: string) => {
  switch (fileType) {
    case "word":
      return { icon: FileText, color: "text-blue-600", accept: ".docx,.doc" }
    case "excel":
      return { icon: FileSpreadsheet, color: "text-green-600", accept: ".xlsx,.xls" }
    case "powerpoint":
      return { icon: Presentation, color: "text-orange-600", accept: ".pptx,.ppt" }
    case "pdf":
      return { icon: File, color: "text-red-600", accept: ".pdf" }
    default:
      return { icon: FileText, color: "text-gray-600", accept: ".txt" }
  }
}

// Cores para cada departamento
const departmentColors = {
  TI: "#3b82f6",
  Vendas: "#10b981",
  RH: "#f59e0b",
  Financeiro: "#8b5cf6",
  Diretoria: "#ef4444",
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

const statusLabels = {
  draft: "Rascunho",
  pending: "Em Aprovação",
  approved: "Aprovado",
  rejected: "Rejeitado",
}

export default function DocumentManagementPlatform() {
  const [documents, setDocuments] = useState(mockDocuments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showDocumentPreview, setShowDocumentPreview] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [activeView, setActiveView] = useState("dashboard")
  const [adminView, setAdminView] = useState("overview")
  const [chartAreaFilter, setChartAreaFilter] = useState("all")
  const [chartTypeFilter, setChartTypeFilter] = useState("all")
  const [documentModalMode, setDocumentModalMode] = useState("view") // 'view', 'edit', 'new-version'
  const [showCreationSelector, setShowCreationSelector] = useState(false)

  // Estados para o modal de documentos por categoria
  const [showDocumentListModal, setShowDocumentListModal] = useState(false)
  const [documentListFilter, setDocumentListFilter] = useState("all") // 'all', 'approved', 'pending', 'draft'
  const [documentListTitle, setDocumentListTitle] = useState("")

  // Dados fictícios removidos para testes em produção - REPLACED BY mockDocuments ABOVE
  // const mockDocuments = []

  // Dados fictícios removidos para testes em produção - REPLACED BY monthlyEvolutionData ABOVE
  // const monthlyEvolutionData = []

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    const matchesSector = sectorFilter === "all" || doc.sector === sectorFilter

    return matchesSearch && matchesStatus && matchesSector
  })

  const stats = {
    total: documents.length,
    approved: documents.filter((d) => d.status === "approved").length,
    pending: documents.filter((d) => d.status === "pending").length,
    draft: documents.filter((d) => d.status === "draft").length,
  }

  // Função para filtrar documentos por categoria para o modal
  const getDocumentsByCategory = (category) => {
    switch (category) {
      case "approved":
        return documents.filter((d) => d.status === "approved")
      case "pending":
        return documents.filter((d) => d.status === "pending")
      case "draft":
        return documents.filter((d) => d.status === "draft")
      default:
        return documents
    }
  }

  // Função para abrir modal com documentos filtrados
  const handleCardClick = (category) => {
    setDocumentListFilter(category)
    setDocumentListTitle(
      category === "all"
        ? "Todos os Documentos"
        : category === "approved"
          ? "Documentos Aprovados"
          : category === "pending"
            ? "Documentos Pendentes"
            : category === "draft"
              ? "Documentos em Rascunho"
              : "",
    )
    setShowDocumentListModal(true)
  }

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc)
    setShowDocumentPreview(true)
  }

  const handleEditFromPreview = () => {
    setShowDocumentPreview(false)
    setDocumentModalMode("edit")
    setShowDocumentModal(true)
  }

  const handleViewAuditFromPreview = () => {
    setShowDocumentPreview(false)
    setShowAuditModal(true)
  }

  // Função para enviar documento para aprovação
  const handleSendForApproval = (doc) => {
    setDocuments((docs) =>
      docs.map((d) =>
        d.id === doc.id ? { ...d, status: "pending", updatedAt: new Date().toISOString().split("T")[0] } : d,
      ),
    )
  }

  // Função para criar nova versão
  const handleCreateNewVersion = (doc) => {
    setSelectedDocument(doc)
    setDocumentModalMode("new-version")
    setShowDocumentModal(true)
  }

  // Função para visualizar documento (somente leitura)
  const handleViewDocument = (doc) => {
    setSelectedDocument(doc)
    setDocumentModalMode("view")
    setShowDocumentModal(true)
  }

  // Função para editar documento
  const handleEditDocument = (doc) => {
    setSelectedDocument(doc)
    setDocumentModalMode("edit")
    setShowDocumentModal(true)
  }

  const handleDownloadFromPreview = (doc) => {
    if (doc) {
      const fileTypeInfo = getFileTypeIcon(doc.fileType)
      const fileExtension = fileTypeInfo.accept.split(",")[0].replace(".", "")
      const fileName = `${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}.${fileExtension}`
      const dummyContent = `Conteúdo simulado para o documento: ${doc.title}`
      const blob = new Blob([dummyContent], { type: "application/octet-stream" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      console.log("Download iniciado para:", fileName)
    }
  }

  // Função para renderizar as opções do dropdown baseado no status
  const renderDocumentActions = (doc) => {
    const actions = []

    switch (doc.status) {
      case "draft":
        // Rascunho: Editar, Enviar para Aprovação, Auditoria, Download
        actions.push(
          <DropdownMenuItem
            key="edit"
            onClick={(e) => {
              e.stopPropagation()
              handleEditDocument(doc)
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>,
        )
        actions.push(
          <DropdownMenuItem
            key="send-approval"
            onClick={(e) => {
              e.stopPropagation()
              handleSendForApproval(doc)
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar para Aprovação
          </DropdownMenuItem>,
        )
        break

      case "approved":
        // Aprovado: Visualizar, Gerar Nova Versão, Auditoria, Download
        actions.push(
          <DropdownMenuItem
            key="view"
            onClick={(e) => {
              e.stopPropagation()
              handleViewDocument(doc)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </DropdownMenuItem>,
        )
        actions.push(
          <DropdownMenuItem
            key="new-version"
            onClick={(e) => {
              e.stopPropagation()
              handleCreateNewVersion(doc)
            }}
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Gerar Nova Versão
          </DropdownMenuItem>,
        )
        break

      case "pending":
        // Em Aprovação: Visualizar, Ver Aprovação, Auditoria, Download
        actions.push(
          <DropdownMenuItem
            key="view"
            onClick={(e) => {
              e.stopPropagation()
              handleViewDocument(doc)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </DropdownMenuItem>,
        )
        actions.push(
          <DropdownMenuItem
            key="view-approval"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedDocument(doc)
              setShowApprovalModal(true)
            }}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Ver Aprovação
          </DropdownMenuItem>,
        )
        break

      case "rejected":
        // Rejeitado: Visualizar, Gerar Nova Versão, Auditoria, Download
        actions.push(
          <DropdownMenuItem
            key="view"
            onClick={(e) => {
              e.stopPropagation()
              handleViewDocument(doc)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </DropdownMenuItem>,
        )
        actions.push(
          <DropdownMenuItem
            key="new-version"
            onClick={(e) => {
              e.stopPropagation()
              handleCreateNewVersion(doc)
            }}
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Gerar Nova Versão
          </DropdownMenuItem>,
        )
        break

      default:
        // Fallback para visualizar
        actions.push(
          <DropdownMenuItem
            key="view"
            onClick={(e) => {
              e.stopPropagation()
              handleViewDocument(doc)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </DropdownMenuItem>,
        )
    }

    // Auditoria e Download são sempre disponíveis
    actions.push(
      <DropdownMenuItem
        key="audit"
        onClick={(e) => {
          e.stopPropagation()
          setSelectedDocument(doc)
          setShowAuditModal(true)
        }}
      >
        <Clock className="h-4 w-4 mr-2" />
        Auditoria
      </DropdownMenuItem>,
    )
    actions.push(
      <DropdownMenuItem
        key="download"
        onClick={(e) => {
          e.stopPropagation()
          handleDownloadFromPreview(doc)
        }}
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </DropdownMenuItem>,
    )

    return actions
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard()
      case "documents":
        return renderDocuments()
      case "approvals":
        return renderApprovals()
      case "editor": // Added editor case
        return <DocumentEditor />
      case "ai-create":
        return <AIDocumentCreator />
      case "notifications":
        return <NotificationManagement />
      case "admin":
        return renderAdmin()
      case "help":
        return <HelpCenter />
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick("all")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick("approved")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Taxa de aprovação: 85%</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick("pending")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick("draft")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Em desenvolvimento</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução Mensal */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Evolução Mensal de Documentos por Área</CardTitle>
              <CardDescription>Criação de novos documentos nos últimos 7 meses</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={chartAreaFilter} onValueChange={setChartAreaFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Áreas</SelectItem>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Diretoria">Diretoria</SelectItem>
                </SelectContent>
              </Select>
              <Select value={chartTypeFilter} onValueChange={setChartTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Política">Política</SelectItem>
                  <SelectItem value="Procedimento">Procedimento</SelectItem>
                  <SelectItem value="Relatório">Relatório</SelectItem>
                  <SelectItem value="Ata">Ata</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyEvolutionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "14px",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: "600" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />

                {/* Renderizar linhas baseado no filtro de área */}
                {(chartAreaFilter === "all" || chartAreaFilter === "TI") && (
                  <Line
                    type="monotone"
                    dataKey="TI"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2, fill: "#ffffff" }}
                  />
                )}
                {(chartAreaFilter === "all" || chartAreaFilter === "Vendas") && (
                  <Line
                    type="monotone"
                    dataKey="Vendas"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: "#10b981", strokeWidth: 2, fill: "#ffffff" }}
                  />
                )}
                {(chartAreaFilter === "all" || chartAreaFilter === "RH") && (
                  <Line
                    type="monotone"
                    dataKey="RH"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: "#f59e0b", strokeWidth: 2, fill: "#ffffff" }}
                  />
                )}
                {(chartAreaFilter === "all" || chartAreaFilter === "Financeiro") && (
                  <Line
                    type="monotone"
                    dataKey="Financeiro"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: "#8b5cf6", strokeWidth: 2, fill: "#ffffff" }}
                  />
                )}
                {(chartAreaFilter === "all" || chartAreaFilter === "Diretoria") && (
                  <Line
                    type="monotone"
                    dataKey="Diretoria"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: "#ef4444", strokeWidth: 2, fill: "#ffffff" }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Resumo das tendências - filtrado */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(departmentColors)
              .filter(([dept]) => chartAreaFilter === "all" || chartAreaFilter === dept)
              .map(([dept, color]) => {
                // Estes dados agora dependem de monthlyEvolutionData, que está vazio.
                // Em um cenário real, você buscaria esses dados de uma API.
                const currentMonth =
                  monthlyEvolutionData.length > 0 ? monthlyEvolutionData[monthlyEvolutionData.length - 1][dept] : 0
                const previousMonth =
                  monthlyEvolutionData.length > 1 ? monthlyEvolutionData[monthlyEvolutionData.length - 2][dept] : 0
                const growth =
                  previousMonth !== 0 ? (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1) : "N/A"
                const isPositive = Number.parseFloat(growth) > 0

                return (
                  <div key={dept} className="text-center p-4 border rounded-lg bg-gray-50/50">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                      <span className="font-medium text-sm">{dept}</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{currentMonth}</div>
                    <div className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPositive ? "+" : ""}
                      {growth}% vs mês anterior
                    </div>
                  </div>
                )
              })}
          </div>

          {/* Indicador de filtro ativo */}
          {(chartAreaFilter !== "all" || chartTypeFilter !== "all") && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span>Filtros ativos:</span>
              {chartAreaFilter !== "all" && <Badge variant="secondary">Área: {chartAreaFilter}</Badge>}
              {chartTypeFilter !== "all" && <Badge variant="secondary">Tipo: {chartTypeFilter}</Badge>}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setChartAreaFilter("all")
                  setChartTypeFilter("all")
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity and Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`mt-1 ${activity.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.document}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos por Setor</CardTitle>
            <CardDescription>Distribuição de documentos por departamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sectorDistribution.map((item) => (
              <div key={item.sector} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium text-gray-900">{item.sector}</span>
                  </div>
                  <span className="text-gray-600">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="pending">Em Aprovação</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Setores</SelectItem>
                <SelectItem value="TI">TI</SelectItem>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="RH">RH</SelectItem>
                <SelectItem value="Diretoria">Diretoria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum documento encontrado.</p>
              </div>
            ) : (
              filteredDocuments.map((doc) => {
                const fileTypeInfo = getFileTypeIcon(doc.fileType)
                const FileIcon = fileTypeInfo.icon

                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleDocumentClick(doc)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <FileIcon className={`h-5 w-5 ${fileTypeInfo.color}`} />
                        <div>
                          <h3 className="font-medium hover:text-blue-600 transition-colors">{doc.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{doc.number}</span>
                            <span>v{doc.version}</span>
                            <span>{doc.author}</span>
                            <span>{doc.sector}</span>
                            {doc.fileName && <span>{doc.fileName}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={statusColors[doc.status]}>{statusLabels[doc.status]}</Badge>
                      {doc.status === "pending" && (
                        <div className="text-sm text-gray-500">
                          {doc.approvals}/{doc.totalApprovals} aprovações
                        </div>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">{renderDocumentActions(doc)}</DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderApprovals = () => (
    <Card>
      <CardHeader>
        <CardTitle>Aprovações Pendentes</CardTitle>
        <CardDescription>Documentos aguardando sua aprovação</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.filter((doc) => doc.status === "pending").length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum documento pendente de aprovação.</p>
            </div>
          ) : (
            documents
              .filter((doc) => doc.status === "pending")
              .map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{doc.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {doc.number} • v{doc.version} • {doc.author} • {doc.sector}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDocument(doc)
                        setShowApprovalModal(true)
                      }}
                    >
                      Revisar
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderAdmin = () => {
    return (
      <div className="space-y-6">
        {adminView !== "overview" && (
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => setAdminView("overview")}
              className="text-blue-600 hover:text-blue-700"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar para Visão Geral da Administração
            </Button>
          </div>
        )}
        {(() => {
          // Wrap the switch in an IIFE to allow it to be a direct child of the div
          switch (adminView) {
            case "users":
              return <UserManagement />
            case "workflows":
              return <WorkflowManagement />
            case "document-types":
              return <DocumentTypeManagement />
            case "productivity-report":
              return <ProductivityReport />
            case "approval-time-report":
              return <ApprovalTimeReport />
            case "audit-report":
              return <AuditReport />
            case "document-access-report":
              return <DocumentAccessReport />
            case "departments":
              return <DepartmentManagement />
            case "categories":
              return <CategoryManagement />
            case "billing":
              return <BillingManagement />
            default:
              return renderAdminOverview()
          }
        })()}
      </div>
    )
  }

  const renderAdminOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setAdminView("users")}
          >
            <Users className="h-4 w-4 mr-2" />
            Gerenciar Usuários
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setAdminView("workflows")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Configurar Fluxos de Aprovação
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setAdminView("document-types")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Tipos de Documento
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setAdminView("departments")}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Gerenciar Departamentos
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setAdminView("categories")}
          >
            <Tag className="h-4 w-4 mr-2" />
            Gerenciar Categorias
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setAdminView("billing")}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Planos e Pagamentos
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setAdminView("productivity-report")}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Relatório de Produtividade
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setAdminView("approval-time-report")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Tempo de Aprovação
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setAdminView("document-access-report")}
          >
            <Eye className="h-4 w-4 mr-2" />
            Documentos Mais Acessados
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setAdminView("audit-report")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Auditoria Completa
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  // Nova função para lidar com a mudança de visão, incluindo o reset do adminView
  const handleViewChange = (view: string) => {
    setActiveView(view)
    if (view === "admin") {
      setAdminView("overview") // Reseta para a visão geral da administração
    }
  }

  const handleCreationOptionSelect = (option: "upload" | "manual" | "ai") => {
    if (option === "upload") {
      // Fluxo existente de upload
      setSelectedDocument(null)
      setDocumentModalMode("create")
      setShowDocumentModal(true)
    } else if (option === "manual") {
      setActiveView("editor")
    } else if (option === "ai") {
      // Redirecionar para aba de criação com IA
      setActiveView("ai-create")
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={handleViewChange} pendingApprovalsCount={stats.pending} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeView === "dashboard" && "Dashboard"}
                  {activeView === "documents" && "Documentos"}
                  {activeView === "approvals" && "Aprovações"}
                  {activeView === "editor" && "Editor de Documentos"} {/* Added editor title */}
                  {activeView === "ai-create" && "Criar com IA"}
                  {activeView === "notifications" && "Notificações"}
                  {activeView === "admin" && "Administração"}
                  {activeView === "help" && "Central de Ajuda"}
                </h1>
                {activeView === "admin" && adminView !== "overview" && (
                  <>
                    <span className="text-gray-400">/</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAdminView("overview")}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {adminView === "users" && "Gerenciar Usuários"}
                      {adminView === "workflows" && "Fluxos de Aprovação"}
                      {adminView === "document-types" && "Tipos de Documento"}
                      {adminView === "productivity-report" && "Relatório de Produtividade"}
                      {adminView === "approval-time-report" && "Tempo de Aprovação"}
                      {adminView === "audit-report" && "Auditoria Completa"}
                      {adminView === "document-access-report" && "Documentos Mais Acessados"}
                      {adminView === "departments" && "Gerenciar Departamentos"}
                      {adminView === "categories" && "Gerenciar Categorias"}
                      {adminView === "billing" && "Planos e Pagamentos"}
                    </Button>
                  </>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-1">
                {activeView === "dashboard" && "Visão geral do sistema"}
                {activeView === "documents" && "Gerencie todos os documentos"}
                {activeView === "approvals" && "Documentos pendentes de aprovação"}
                {activeView === "editor" && "Crie documentos diretamente na plataforma"}{" "}
                {/* Added editor description */}
                {activeView === "ai-create" && "Gere documentos profissionais usando inteligência artificial"}
                {activeView === "notifications" && "Gerencie notificações e comunicações"}
                {/* ... existing admin descriptions ... */}
                {activeView === "help" && "Encontre respostas, tutoriais e suporte técnico"}
              </p>
            </div>
            <Button
              onClick={() => {
                setShowCreationSelector(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Documento
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>

      {/* Modal de Lista de Documentos por Categoria */}
      <Dialog open={showDocumentListModal} onOpenChange={setShowDocumentListModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">{documentListTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {getDocumentsByCategory(documentListFilter).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum documento encontrado nesta categoria.</p>
              </div>
            ) : (
              getDocumentsByCategory(documentListFilter).map((doc) => {
                const fileTypeInfo = getFileTypeIcon(doc.fileType)
                const FileIcon = fileTypeInfo.icon

                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setShowDocumentListModal(false)
                      handleDocumentClick(doc)
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <FileIcon className={`h-5 w-5 ${fileTypeInfo.color}`} />
                        <div>
                          <h3 className="font-medium hover:text-blue-600 transition-colors">{doc.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{doc.number}</span>
                            <span>v{doc.version}</span>
                            <span>{doc.author}</span>
                            <span>{doc.sector}</span>
                            {doc.fileName && <span>{doc.fileName}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={statusColors[doc.status]}>{statusLabels[doc.status]}</Badge>
                      {doc.status === "pending" && (
                        <div className="text-sm text-gray-500">
                          {doc.approvals}/{doc.totalApprovals} aprovações
                        </div>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">{renderDocumentActions(doc)}</DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <DocumentModal
        open={showDocumentModal}
        onOpenChange={setShowDocumentModal}
        document={documentModalMode === "create" ? null : selectedDocument}
        mode={documentModalMode}
        onSave={(doc) => {
          if (documentModalMode === "create") {
            setDocuments((docs) => [...docs, { ...doc, id: Date.now() }])
          } else if (documentModalMode === "new-version") {
            // Criar nova versão do documento
            const currentVersion = Number.parseFloat(selectedDocument.version)
            const newVersion = (Math.floor(currentVersion) + 1).toFixed(1)
            const newDoc = {
              ...doc,
              id: Date.now(),
              version: newVersion,
              status: "draft",
              createdAt: new Date().toISOString().split("T")[0],
              updatedAt: new Date().toISOString().split("T")[0],
            }
            setDocuments((docs) => [...docs, newDoc])
          } else {
            setDocuments((docs) => docs.map((d) => (d.id === selectedDocument.id ? { ...d, ...doc } : d)))
          }
          setShowDocumentModal(false)
          setSelectedDocument(null)
          setDocumentModalMode("view")
        }}
      />

      <DocumentPreviewModal
        open={showDocumentPreview}
        onOpenChange={setShowDocumentPreview}
        document={selectedDocument}
        onEdit={handleEditFromPreview}
        onDownload={() => handleDownloadFromPreview(selectedDocument)} // Use a nova função aqui
        onViewAudit={handleViewAuditFromPreview}
      />

      <ApprovalModal
        open={showApprovalModal}
        onOpenChange={setShowApprovalModal}
        document={selectedDocument}
        onApprove={(decision) => {
          if (selectedDocument) {
            setDocuments((docs) =>
              docs.map((d) =>
                d.id === selectedDocument.id ? { ...d, status: decision.approved ? "approved" : "rejected" } : d,
              ),
            )
          }
          setShowApprovalModal(false)
          setSelectedDocument(null)
        }}
      />

      <AuditModal open={showAuditModal} onOpenChange={setShowAuditModal} document={selectedDocument} />

      <DocumentCreationSelector
        open={showCreationSelector}
        onOpenChange={setShowCreationSelector}
        onSelectOption={handleCreationOptionSelect}
      />
    </div>
  )
}
