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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Building2, Users } from "lucide-react"

// Dados pré-configurados para Departamentos com usersCount zerado
const mockDepartments = [
  { id: "1", name: "Recursos Humanos", usersCount: 0 },
  { id: "2", name: "Financeiro", usersCount: 0 },
  { id: "3", name: "Marketing", usersCount: 0 },
  { id: "4", name: "Tecnologia", usersCount: 0 },
]

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState(mockDepartments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [showDepartmentModal, setShowDepartmentModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState(null)

  const handleSaveDepartment = (departmentData) => {
    if (departmentData.id) {
      // Editar departamento existente
      setDepartments((prevDepartments) =>
        prevDepartments.map((dep) => (dep.id === departmentData.id ? { ...dep, ...departmentData } : dep)),
      )
    } else {
      // Criar novo departamento
      const newDepartment = {
        id: Date.now().toString(), // ID temporário
        usersCount: 0, // Novo departamento começa com 0 usuários
        ...departmentData,
      }
      setDepartments((prevDepartments) => [...prevDepartments, newDepartment])
    }
    setShowDepartmentModal(false)
    setSelectedDepartment(null)
  }

  const handleDeleteDepartment = () => {
    setDepartments((prevDepartments) => prevDepartments.filter((dep) => dep.id !== departmentToDelete.id))
    setShowDeleteConfirm(false)
    setDepartmentToDelete(null)
  }

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Departamentos</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{departments.length}</div>
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
                  placeholder="Buscar departamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Dialog open={showDepartmentModal} onOpenChange={setShowDepartmentModal}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedDepartment(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Departamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{selectedDepartment ? "Editar Departamento" : "Novo Departamento"}</DialogTitle>
                </DialogHeader>
                <DepartmentForm
                  department={selectedDepartment}
                  onSave={handleSaveDepartment}
                  onCancel={() => setShowDepartmentModal(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Departments List */}
      <Card>
        <CardHeader>
          <CardTitle>Departamentos ({filteredDepartments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDepartments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum departamento encontrado.</p>
              </div>
            ) : (
              filteredDepartments.map((department) => (
                <div
                  key={department.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-medium">{department.name}</h3>
                      <p className="text-sm text-gray-500">
                        <Users className="inline-block h-3 w-3 mr-1" />
                        {department.usersCount} usuários
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
                            setSelectedDepartment(department)
                            setShowDepartmentModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDepartmentToDelete(department)
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
    id: department?.id || null,
    name: department?.name || "",
  })

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Departamento</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Recursos Humanos"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>{department ? "Salvar Alterações" : "Criar Departamento"}</Button>
      </div>
    </div>
  )
}
