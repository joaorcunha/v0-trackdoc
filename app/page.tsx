"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Folder,
  Users,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  ArrowLeft,
  BarChart2,
  Clock,
  ClipboardCheck,
} from "lucide-react"
import Sidebar from "./components/sidebar"
import DocumentPreviewModal from "./components/document-preview-modal"
import DocumentModal from "./components/document-modal"
import UserManagement from "./components/admin/user-management"
import CategoryManagement from "./components/admin/category-management"
import DepartmentManagement from "./components/admin/department-management"
import DocumentTypeManagement from "./components/admin/document-type-management"
import WorkflowManagement from "./components/admin/workflow-management"
import ProductivityReport from "./components/admin/productivity-report"
import ApprovalTimeReport from "./components/admin/approval-time-report"
import AuditReport from "./components/admin/audit-report"
import ApprovalModal from "./components/approval-modal"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard") // 'dashboard', 'documents', 'approvals', 'admin'
  const [adminSubMenu, setAdminSubMenu] = useState(null) // 'users', 'categories', 'departments', 'document-types', 'workflows', 'productivity-report', 'approval-time-report', 'audit-report'

  const [documents, setDocuments] = useState([
    {
      id: "1",
      title: "Política de Privacidade",
      documentNumber: "DOC-001",
      version: "1.2",
      author: "João Silva",
      createdAt: "2023-10-26",
      status: "published",
      category: "Políticas Internas",
      department: "Jurídico",
      content: "Conteúdo detalhado da política de privacidade...",
      fileUrl: "/placeholder.pdf",
    },
    {
      id: "2",
      title: "Manual do Colaborador",
      documentNumber: "DOC-002",
      version: "1.0",
      author: "Maria Santos",
      createdAt: "2023-11-01",
      status: "pending",
      category: "Manuais",
      department: "Recursos Humanos",
      content: "Guia completo para novos e atuais colaboradores...",
      fileUrl: "/placeholder.pdf",
    },
    {
      id: "3",
      title: "Relatório Financeiro Q3",
      documentNumber: "DOC-003",
      version: "1.0",
      author: "Carlos Oliveira",
      createdAt: "2023-09-30",
      status: "draft",
      category: "Relatórios",
      department: "Financeiro",
      content: "Análise financeira do terceiro trimestre...",
      fileUrl: "/placeholder.pdf",
    },
    {
      id: "4",
      title: "Ata de Reunião - 15/11",
      documentNumber: "DOC-004",
      version: "1.0",
      author: "Ana Souza",
      createdAt: "2023-11-15",
      status: "approved",
      category: "Atas de Reunião",
      department: "Administração",
      content: "Resumo da reunião de planejamento estratégico...",
      fileUrl: "/placeholder.pdf",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState(null)

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveDocument = (docData) => {
    if (docData.id) {
      setDocuments((prevDocs) => prevDocs.map((doc) => (doc.id === docData.id ? { ...doc, ...docData } : doc)))
    } else {
      const newDocument = {
        id: Date.now().toString(),
        documentNumber: `DOC-${Date.now()}`,
        version: "1.0",
        author: "Usuário Atual", // Placeholder for current user
        createdAt: new Date().toISOString().split("T")[0],
        status: "draft",
        ...docData,
      }
      setDocuments((prevDocs) => [...prevDocs, newDocument])
    }
  }

  const handleDeleteDocument = (id) => {
    setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id))
  }

  const handleDownloadDocument = (document) => {
    alert(`Simulando download do documento: ${document.title}`)
    // In a real application, you would initiate a file download here
    // window.open(document.fileUrl, '_blank');
  }

  const handleApproveDocument = (id, comment) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => (doc.id === id ? { ...doc, status: "approved", approvalComment: comment } : doc)),
    )
    alert(`Documento ${id} aprovado com comentário: ${comment}`)
  }

  const handleRejectDocument = (id, comment) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => (doc.id === id ? { ...doc, status: "rejected", approvalComment: comment } : doc)),
    )
    alert(`Documento ${id} rejeitado com comentário: ${comment}`)
  }

  const pendingApprovalsCount = documents.filter((doc) => doc.status === "pending").length

  const renderAdminSubMenu = () => {
    switch (adminSubMenu) {
      case "users":
        return <UserManagement />
      case "categories":
        return <CategoryManagement />
      case "departments":
        return <DepartmentManagement />
      case "document-types":
        return <DocumentTypeManagement />
      case "workflows":
        return <WorkflowManagement />
      case "productivity-report":
        return <ProductivityReport />
      case "approval-time-report":
        return <ApprovalTimeReport />
      case "audit-report":
        return <AuditReport />
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Administração</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setAdminSubMenu("users")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Gerenciar Usuários</CardTitle>
                  <Users className="h-6 w-6 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Adicionar, editar e remover usuários.</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setAdminSubMenu("categories")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Gerenciar Categorias</CardTitle>
                  <Folder className="h-6 w-6 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Organizar documentos por categorias.</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setAdminSubMenu("departments")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Gerenciar Departamentos</CardTitle>
                  <Folder className="h-6 w-6 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Configurar departamentos da organização.</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setAdminSubMenu("document-types")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Tipos de Documento</CardTitle>
                  <FileText className="h-6 w-6 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Definir e gerenciar tipos de documentos.</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setAdminSubMenu("workflows")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Fluxos de Aprovação</CardTitle>
                  <CheckCircle className="h-6 w-6 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Configurar e gerenciar fluxos de aprovação.</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setAdminSubMenu("productivity-report")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Relatório de Produtividade</CardTitle>
                  <BarChart2 className="h-6 w-6 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Visualizar métricas de produtividade.</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setAdminSubMenu("approval-time-report")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Relatório de Tempo de Aprovação</CardTitle>
                  <Clock className="h-6 w-6 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Analisar o tempo médio de aprovação.</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setAdminSubMenu("audit-report")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Relatório de Auditoria</CardTitle>
                  <ClipboardCheck className="h-6 w-6 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Acompanhar todas as atividades do sistema.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar approvalsCount={pendingApprovalsCount} />
      <main className="flex-1 p-6">
        {adminSubMenu && (
          <div className="mb-6">
            <Button variant="outline" onClick={() => setAdminSubMenu(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Visão Geral
            </Button>
          </div>
        )}

        {activeTab === "dashboard" && !adminSubMenu && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documents.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documentos Pendentes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documents.filter((doc) => doc.status === "pending").length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documentos Aprovados</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {documents.filter((doc) => doc.status === "approved").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mt-8">Documentos Recentes</h2>
            <div className="space-y-4">
              {documents.slice(0, 3).map((document) => (
                <Card key={document.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{document.title}</h3>
                        <p className="text-sm text-gray-500">
                          {document.documentNumber} - {document.author}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          document.status === "published"
                            ? "bg-blue-100 text-blue-800"
                            : document.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : document.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }
                      >
                        {document.status === "published"
                          ? "Publicado"
                          : document.status === "pending"
                            ? "Em Aprovação"
                            : document.status === "approved"
                              ? "Aprovado"
                              : "Rascunho"}
                      </Badge>
                      <DocumentPreviewModal
                        document={document}
                        onDownload={handleDownloadDocument}
                        onApprove={handleApproveDocument}
                        onReject={handleRejectDocument}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "documents" && !adminSubMenu && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Documentos</h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
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
              <Button
                onClick={() => {
                  setEditingDocument(null)
                  setIsDocumentModalOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Documento
              </Button>
              <DocumentModal
                isOpen={isDocumentModalOpen}
                onClose={() => setIsDocumentModalOpen(false)}
                document={editingDocument}
                onSave={handleSaveDocument}
              />
            </div>

            <div className="space-y-4">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum documento encontrado.</p>
                </div>
              ) : (
                filteredDocuments.map((document) => (
                  <Card key={document.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <div>
                          <h3 className="font-medium">{document.title}</h3>
                          <p className="text-sm text-gray-500">
                            {document.documentNumber} - {document.author} - {document.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            document.status === "published"
                              ? "bg-blue-100 text-blue-800"
                              : document.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : document.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                          }
                        >
                          {document.status === "published"
                            ? "Publicado"
                            : document.status === "pending"
                              ? "Em Aprovação"
                              : document.status === "approved"
                                ? "Aprovado"
                                : "Rascunho"}
                        </Badge>
                        <DocumentPreviewModal
                          document={document}
                          onDownload={handleDownloadDocument}
                          onApprove={handleApproveDocument}
                          onReject={handleRejectDocument}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingDocument(document)
                                setIsDocumentModalOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteDocument(document.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "approvals" && !adminSubMenu && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Aprovações Pendentes</h1>
            <div className="space-y-4">
              {documents.filter((doc) => doc.status === "pending").length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma aprovação pendente no momento.</p>
                </div>
              ) : (
                documents
                  .filter((doc) => doc.status === "pending")
                  .map((document) => (
                    <Card key={document.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-6 w-6 text-blue-600" />
                          <div>
                            <h3 className="font-medium">{document.title}</h3>
                            <p className="text-sm text-gray-500">
                              {document.documentNumber} - {document.author} - {document.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-100 text-yellow-800">Em Aprovação</Badge>
                          <ApprovalModal
                            document={document}
                            onApprove={handleApproveDocument}
                            onReject={handleRejectDocument}
                          />
                          <DocumentPreviewModal
                            document={document}
                            onDownload={handleDownloadDocument}
                            onApprove={handleApproveDocument}
                            onReject={handleRejectDocument}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </div>
        )}

        {activeTab === "admin" && renderAdminSubMenu()}
      </main>
    </div>
  )
}
