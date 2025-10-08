"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Building2,
  Users,
  FileText,
  CheckCircle,
  Clock,
  Grid3X3,
  List,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const mockDepartments = [
  {
    id: 1,
    name: "Tecnologia da Informação",
    shortName: "TI",
    description: "Responsável pela infraestrutura tecnológica e desenvolvimento de sistemas",
    manager: "João Silva",
    color: "#3b82f6",
    status: "active",
    employeeCount: 15,
    documentsCount: 42,
  },
  {
    id: 2,
    name: "Recursos Humanos",
    shortName: "RH",
    description: "Gestão de pessoas, recrutamento e desenvolvimento organizacional",
    manager: "Maria Santos",
    color: "#10b981",
    status: "active",
    employeeCount: 8,
    documentsCount: 35,
  },
  {
    id: 3,
    name: "Vendas",
    shortName: "VND",
    description: "Equipe comercial e gestão de relacionamento com clientes",
    manager: "Carlos Oliveira",
    color: "#f59e0b",
    status: "active",
    employeeCount: 22,
    documentsCount: 28,
  },
  {
    id: 4,
    name: "Financeiro",
    shortName: "FIN",
    description: "Controle financeiro, contabilidade e planejamento orçamentário",
    manager: "Ana Costa",
    color: "#8b5cf6",
    status: "active",
    employeeCount: 12,
    documentsCount: 31,
  },
  {
    id: 5,
    name: "Diretoria",
    shortName: "DIR",
    description: "Gestão estratégica e tomada de decisões corporativas",
    manager: "Roberto Almeida",
    color: "#ef4444",
    status: "active",
    employeeCount: 5,
    documentsCount: 18,
  },
  {
    id: 6,
    name: "Operações",
    shortName: "OPS",
    description: "Gestão operacional e processos de produção",
    manager: "Paula Ferreira",
    color: "#06b6d4",
    status: "inactive",
    employeeCount: 18,
    documentsCount: 22,
  },
]

const colorOptions = [
  { value: "#3b82f6", label: "Azul", class: "bg-blue-500" },
  { value: "#10b981", label: "Verde", class: "bg-emerald-500" },
  { value: "#f59e0b", label: "Amarelo", class: "bg-amber-500" },
  { value: "#8b5cf6", label: "Roxo", class: "bg-violet-500" },
  { value: "#ef4444", label: "Vermelho", class: "bg-red-500" },
  { value: "#06b6d4", label: "Ciano", class: "bg-cyan-500" },
  { value: "#84cc16", label: "Lima", class: "bg-lime-500" },
  { value: "#f97316", label: "Laranja", class: "bg-orange-500" },
  { value: "#ec4899", label: "Rosa", class: "bg-pink-500" },
  { value: "#6b7280", label: "Cinza", class: "bg-gray-500" },
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
}

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState(mockDepartments)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [showDepartmentModal, setShowDepartmentModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState("list")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    setDepartments(mockDepartments)
    setLoading(false)
  }, [])

  const loadDepartments = async () => {
    setLoading(true)
    setTimeout(() => {
      setDepartments(mockDepartments)
      setLoading(false)
    }, 500)
  }

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.shortName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.manager?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || dept.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: departments.length,
    active: departments.filter((d) => d.status === "active").length,
    inactive: departments.filter((d) => d.status === "inactive").length,
    totalEmployees: departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0),
    totalDocuments: departments.reduce((sum, d) => sum + (d.documentsCount || 0), 0),
  }

  const handleSaveDepartment = async (departmentData) => {
    try {
      if (selectedDepartment) {
        toast({
          title: "Departamento atualizado",
          description: "O departamento foi atualizado com sucesso.",
        })
      } else {
        toast({
          title: "Departamento criado",
          description: "O departamento foi criado com sucesso.",
        })
      }
      setShowDepartmentModal(false)
      setSelectedDepartment(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o departamento.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDepartment = async () => {
    try {
      toast({
        title: "Departamento excluído",
        description: "O departamento foi excluído com sucesso.",
      })
      setShowDeleteConfirm(false)
      setDepartmentToDelete(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o departamento.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Departamentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Em operação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Desativados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Total geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">Criados</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar departamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3 rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3 rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Dialog open={showDepartmentModal} onOpenChange={setShowDepartmentModal}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedDepartment(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Departamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedDepartment ? "Editar Departamento" : "Novo Departamento"}</DialogTitle>
                </DialogHeader>
                <DepartmentForm
                  department={selectedDepartment}
                  onSave={handleSaveDepartment}
                  onCancel={() => {
                    setShowDepartmentModal(false)
                    setSelectedDepartment(null)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {viewMode === "list" ? (
        /* Lista de Departamentos */
        <Card>
          <CardContent className="p-0">
            {filteredDepartments.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                {searchTerm || statusFilter !== "all" ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum departamento encontrado</h3>
                    <p className="text-gray-500 mb-4">
                      Não encontramos departamentos que correspondam aos filtros aplicados
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setStatusFilter("all")
                      }}
                    >
                      Limpar filtros
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum departamento cadastrado</h3>
                    <p className="text-gray-500 mb-4">Comece organizando sua empresa criando o primeiro departamento</p>
                    <Button onClick={() => setShowDepartmentModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Departamento
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filteredDepartments.map((department) => (
                  <div key={department.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: department.color || "#3b82f6" }}
                        >
                          {(department.shortName || department.name || "DP").substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-lg font-semibold">{department.name}</h3>
                            <Badge className={statusColors[department.status] || statusColors.active}>
                              {department.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{department.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {department.manager
                                    ? department.manager
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                    : "??"}
                                </AvatarFallback>
                              </Avatar>
                              <span>{department.manager || "Não definido"}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{department.employeeCount || 0} funcionários</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="h-4 w-4" />
                              <span>{department.documentsCount || 0} documentos</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDepartment(department)
                              setShowDepartmentModal(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setDepartmentToDelete(department)
                              setShowDeleteConfirm(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Grid de Departamentos */
        <div className="grid grid-cols-1 lg:col-span-3 xl:grid-cols-3 gap-6">
          {filteredDepartments.length === 0 ? (
            <Card className="lg:col-span-3">
              <CardContent className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                {searchTerm || statusFilter !== "all" ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum departamento encontrado</h3>
                    <p className="text-gray-500 mb-4">
                      Não encontramos departamentos que correspondam aos filtros aplicados
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setStatusFilter("all")
                      }}
                    >
                      Limpar filtros
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum departamento cadastrado</h3>
                    <p className="text-gray-500 mb-4">Comece organizando sua empresa criando o primeiro departamento</p>
                    <Button onClick={() => setShowDepartmentModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Departamento
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredDepartments.map((department) => (
              <Card key={department.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: department.color || "#3b82f6" }}
                      >
                        {(department.shortName || department.name || "DP").substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{department.name}</CardTitle>
                        <p className="text-sm text-gray-500">{department.shortName || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusColors[department.status] || statusColors.active}>
                        {department.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDepartment(department)
                              setShowDepartmentModal(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setDepartmentToDelete(department)
                              setShowDeleteConfirm(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{department.description}</p>
                    {/* Manager Info */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {department.manager
                            ? department.manager
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{department.manager || "Não definido"}</p>
                        <p className="text-xs text-gray-500">Gerente</p>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-600">{department.employeeCount || 0}</p>
                        <p className="text-xs text-gray-500">Funcionários</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{department.documentsCount || 0}</p>
                        <p className="text-xs text-gray-500">Documentos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* AlertDialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir este departamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente o departamento{" "}
              <span className="font-semibold">{departmentToDelete?.name}</span> e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDepartment} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function DepartmentForm({ department, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: department?.name || "",
    shortName: department?.shortName || "",
    description: department?.description || "",
    manager: department?.manager || "",
    color: department?.color || "#3b82f6",
    status: department?.status || "active",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Departamento</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Tecnologia da Informação"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortName">Nome Abreviado</Label>
          <Input
            id="shortName"
            value={formData.shortName}
            onChange={(e) => setFormData((prev) => ({ ...prev, shortName: e.target.value }))}
            placeholder="Ex: TI"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Descreva as responsabilidades e função do departamento"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="manager">Gerente</Label>
        <Input
          id="manager"
          value={formData.manager}
          onChange={(e) => setFormData((prev) => ({ ...prev, manager: e.target.value }))}
          placeholder="Nome do gerente"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Cor do Departamento</Label>
          <Select value={formData.color} onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${color.class}`}></div>
                    <span>{color.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.status === "active"}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))}
          />
          <Label>Departamento ativo</Label>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Departamento</Button>
      </div>
    </form>
  )
}
