"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import DocumentDetailsModal from "./document-details-modal"
import {
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  Calendar,
  Search,
  BarChart3,
  Building2,
} from "lucide-react"
import { getDocuments, getDepartments } from "@/app/admin/actions"

export default function DocumentAccessReport() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [docsData, deptsData] = await Promise.all([
        getDocuments(),
        getDepartments(),
      ])
      setDocuments(docsData.map((doc: any) => ({
        id: doc.id,
        documentNumber: doc.document_number,
        title: doc.title,
        department: doc.department?.short_name || doc.department?.name || "N/A",
        category: doc.document_type?.name || "N/A",
        totalViews: 0,
        uniqueUsers: 0,
        downloadsCount: 0,
        lastAccessed: doc.updated_at,
        trend: "stable",
        trendPercentage: 0,
        viewsThisWeek: 0,
        viewsLastWeek: 0,
        topViewers: [],
      })))
      setDepartments(deptsData)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredData = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || doc.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const totalViews = documents.reduce((sum, doc) => sum + doc.totalViews, 0)
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloadsCount, 0)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">Documentos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">Total de visualizações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">Total de downloads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Com documentos</p>
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
                  placeholder="Buscar documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.short_name || dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Mais Acessados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum documento encontrado.</p>
          ) : (
            <div className="space-y-4">
              {filteredData.map((doc, index) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedDocument(doc)
                    setShowDetailsModal(true)
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{doc.documentNumber}</span>
                        <span>•</span>
                        <Badge variant="outline">{doc.department}</Badge>
                        <Badge variant="secondary">{doc.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{doc.totalViews}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Visualizações</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{doc.uniqueUsers}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Usuários</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{doc.downloadsCount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Downloads</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {doc.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : doc.trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={`text-sm ${
                          doc.trendPercentage > 0
                            ? "text-green-600"
                            : doc.trendPercentage < 0
                            ? "text-red-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {doc.trendPercentage > 0 ? "+" : ""}
                        {doc.trendPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Details Modal */}
      {selectedDocument && (
        <DocumentDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          document={selectedDocument}
        />
      )}
    </div>
  )
}
