"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Folder, FileText } from "lucide-react"

// Dados pré-configurados para Categorias com documentsCount zerado
const mockCategories = [
  { id: "1", name: "Políticas Internas", documentsCount: 0 },
  { id: "2", name: "Relatórios", documentsCount: 0 },
  { id: "3", name: "Contratos", documentsCount: 0 },
  { id: "4", name: "Manuais", documentsCount: 0 },
]

export default function CategoryManagement() {
  const [categories, setCategories] = useState(mockCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const handleSaveCategory = (categoryData) => {
    if (categoryData.id) {
      // Editar categoria existente
      setCategories((prevCategories) =>
        prevCategories.map((cat) => (cat.id === categoryData.id ? { ...cat, ...categoryData } : cat)),
      )
    } else {
      // Criar nova categoria
      const newCategory = {
        id: Date.now().toString(), // ID temporário
        documentsCount: 0, // Nova categoria começa com 0 documentos
        ...categoryData,
      }
      setCategories((prevCategories) => [...prevCategories, newCategory])
    }
    setShowCategoryModal(false)
    setSelectedCategory(null)
  }

  const handleDeleteCategory = () => {
    setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== categoryToDelete.id))
    setShowDeleteConfirm(false)
    setCategoryToDelete(null)
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
          <Folder className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categories.length}</div>
        </CardContent>
      </Card>

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
            <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedCategory(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
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
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma categoria encontrada.</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <Folder className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        <FileText className="inline-block h-3 w-3 mr-1" />
                        {category.documentsCount} documentos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
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
                          onClick={() => {
                            setCategoryToDelete(category)
                            setShowDeleteConfirm(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

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
    id: category?.id || null,
    name: category?.name || "",
  })

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Categoria</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Políticas Internas"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>{category ? "Salvar Alterações" : "Criar Categoria"}</Button>
      </div>
    </div>
  )
}
