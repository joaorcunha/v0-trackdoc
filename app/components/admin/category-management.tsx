"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  FolderOpen,
  Archive,
  CheckCircle,
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

const colorOptions = [
  { value: "red", label: "Vermelho", class: "bg-red-100 text-red-800" },
  { value: "green", label: "Verde", class: "bg-green-100 text-green-800" },
  { value: "blue", label: "Azul", class: "bg-blue-100 text-blue-800" },
  { value: "purple", label: "Roxo", class: "bg-purple-100 text-purple-800" },
  { value: "yellow", label: "Amarelo", class: "bg-yellow-100 text-yellow-800" },
  { value: "gray", label: "Cinza", class: "bg-gray-100 text-gray-800" },
  { value: "orange", label: "Laranja", class: "bg-orange-100 text-orange-800" },
  { value: "pink", label: "Rosa", class: "bg-pink-100 text-pink-800" },
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
}

const mockCategories = [
  {
    id: 1,
    name: "Segurança",
    description: "Documentos relacionados à segurança da informação e proteção de dados",
    color: "red",
    status: "active",
    documentsCount: 24,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
  },
  {
    id: 2,
    name: "Qualidade",
    description: "Procedimentos e políticas de qualidade ISO 9001",
    color: "blue",
    status: "active",
    documentsCount: 18,
    createdAt: "2024-01-20",
    updatedAt: "2024-03-05",
  },
  {
    id: 3,
    name: "Recursos Humanos",
    description: "Políticas de RH, benefícios e gestão de pessoas",
    color: "green",
    status: "active",
    documentsCount: 32,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-12",
  },
  {
    id: 4,
    name: "Financeiro",
    description: "Procedimentos financeiros, orçamentos e relatórios",
    color: "yellow",
    status: "active",
    documentsCount: 15,
    createdAt: "2024-02-10",
    updatedAt: "2024-03-08",
  },
  {
    id: 5,
    name: "Operacional",
    description: "Processos operacionais e procedimentos de rotina",
    color: "purple",
    status: "active",
    documentsCount: 28,
    createdAt: "2024-02-15",
    updatedAt: "2024-03-11",
  },
  {
    id: 6,
    name: "Compliance",
    description: "Documentos de conformidade legal e regulatória",
    color: "orange",
    status: "inactive",
    documentsCount: 12,
    createdAt: "2024-01-25",
    updatedAt: "2024-02-28",
  },
]

export default function CategoryManagement() {
  const [categories, setCategories] = useState(mockCategories)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [viewMode, setViewMode] = useState("list")
  const { toast } = useToast()

  useEffect(() => {
    setCategories(mockCategories)
    setLoading(false)
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    setTimeout(() => {
      setCategories(mockCategories)
      setLoading(false)
    }, 500)
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.status === "active").length,
    inactive: categories.filter((c) => c.status === "inactive").length,
    totalDocuments: categories.reduce((sum, c) => sum + c.documentsCount, 0),
  }

  const handleSaveCategory = async (categoryData) => {
    try {
      if (selectedCategory) {
        toast({
          title: "Categoria atualizada",
          description: "A categoria foi atualizada com sucesso.",
        })
      } else {
        toast({
          title: "Categoria criada",
          description: "A categoria foi criada com sucesso.",
        })
      }
      setShowCategoryModal(false)
      setSelectedCategory(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a categoria.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async () => {
    try {
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      })
      setShowDeleteConfirm(false)
      setCategoryToDelete(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a categoria.",
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias Inativas</CardTitle>
            <Archive className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
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
              <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedCategory(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{selectedCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
                  </DialogHeader>
                  <CategoryForm
                    category={selectedCategory}
                    onSave={handleSaveCategory}
                    onCancel={() => setShowCategoryModal(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 lg:col-span-3 xl:grid-cols-3 gap-6">
          {filteredCategories.length === 0 ? (
            <Card className="lg:col-span-3">
              <CardContent className="text-center py-12">
                <Tag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                {searchTerm ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma categoria encontrada</h3>
                    <p className="text-gray-500 mb-4">
                      Não encontramos categorias que correspondam à sua busca "{searchTerm}"
                    </p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Limpar busca
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma categoria cadastrada</h3>
                    <p className="text-gray-500 mb-4">
                      Crie sua primeira categoria para organizar melhor os documentos
                    </p>
                    <Button onClick={() => setShowCategoryModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Categoria
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          colorOptions.find((c) => c.value === category.color)?.class
                        }`}
                      >
                        <Tag className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <p className="text-sm text-gray-500">{category.documentsCount} documentos</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusColors[category.status]}>
                        {category.status === "active" ? "Ativa" : "Inativa"}
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
                              setSelectedCategory(category)
                              setShowCategoryModal(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setCategoryToDelete(category)
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
                    <p className="text-sm text-gray-600">{category.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                      <span>Criada em {new Date(category.createdAt).toLocaleDateString()}</span>
                      <span>Atualizada em {new Date(category.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                {searchTerm ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma categoria encontrada</h3>
                    <p className="text-gray-500 mb-4">
                      Não encontramos categorias que correspondam à sua busca "{searchTerm}"
                    </p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Limpar busca
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma categoria cadastrada</h3>
                    <p className="text-gray-500 mb-4">
                      Crie sua primeira categoria para organizar melhor os documentos
                    </p>
                    <Button onClick={() => setShowCategoryModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Categoria
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            colorOptions.find((c) => c.value === category.color)?.class
                          }`}
                        >
                          <Tag className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-lg font-semibold">{category.name}</h3>
                            <Badge className={statusColors[category.status]}>
                              {category.status === "active" ? "Ativa" : "Inativa"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{category.documentsCount} documentos</span>
                            <span>Criada em {new Date(category.createdAt).toLocaleDateString()}</span>
                            <span>Atualizada em {new Date(category.updatedAt).toLocaleDateString()}</span>
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
                              setSelectedCategory(category)
                              setShowCategoryModal(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setCategoryToDelete(category)
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
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir esta categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente a categoria{" "}
              <span className="font-semibold">{categoryToDelete?.name}</span> e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function CategoryForm({ category, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    color: category?.color || "blue",
    status: category?.status || "active",
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Categoria</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Segurança"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Descreva o propósito desta categoria"
          rows={3}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor</Label>
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
        <Label>Categoria ativa</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{category ? "Salvar Alterações" : "Criar Categoria"}</Button>
      </div>
    </form>
  )
}
