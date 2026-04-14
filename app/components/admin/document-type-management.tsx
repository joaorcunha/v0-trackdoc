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
import { Plus, Search, MoreHorizontal, Edit, Trash2, FileText, ScrollText } from "lucide-react"

// Dados pré-configurados para Tipos de Documento com documentsCount zerado
const mockDocumentTypes = [
  { id: "1", name: "Política", documentsCount: 0 },
  { id: "2", name: "Procedimento", documentsCount: 0 },
  { id: "3", name: "Relatório", documentsCount: 0 },
  { id: "4", name: "Ata", documentsCount: 0 },
]

export default function DocumentTypeManagement() {
  const [documentTypes, setDocumentTypes] = useState(mockDocumentTypes)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDocumentType, setSelectedDocumentType] = useState(null)
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [documentTypeToDelete, setDocumentTypeToDelete] = useState(null)

  const handleSaveDocumentType = (documentTypeData) => {
    if (documentTypeData.id) {
      // Editar tipo de documento existente
      setDocumentTypes((prevTypes) =>
        prevTypes.map((type) => (type.id === documentTypeData.id ? { ...type, ...documentTypeData } : type)),
      )
    } else {
      // Criar novo tipo de documento
      const newDocumentType = {
        id: Date.now().toString(), // ID temporário
        documentsCount: 0, // Novo tipo de documento começa com 0 documentos
        ...documentTypeData,
      }
      setDocumentTypes((prevTypes) => [...prevTypes, newDocumentType])
    }
    setShowDocumentTypeModal(false)
    setSelectedDocumentType(null)
  }

  const handleDeleteDocumentType = () => {
    setDocumentTypes((prevTypes) => prevTypes.filter((type) => type.id !== documentTypeToDelete.id))
    setShowDeleteConfirm(false)
    setDocumentTypeToDelete(null)
  }

  const filteredDocumentTypes = documentTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Tipos de Documento</CardTitle>
          <ScrollText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{documentTypes.length}</div>
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
                  placeholder="Buscar tipos de documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Dialog open={showDocumentTypeModal} onOpenChange={setShowDocumentTypeModal}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedDocumentType(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Tipo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {selectedDocumentType ? "Editar Tipo de Documento" : "Novo Tipo de Documento"}
                  </DialogTitle>
                </DialogHeader>
                <DocumentTypeForm
                  documentType={selectedDocumentType}
                  onSave={handleSaveDocumentType}
                  onCancel={() => setShowDocumentTypeModal(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Document Types List */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Documento ({filteredDocumentTypes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocumentTypes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ScrollText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum tipo de documento encontrado.</p>
              </div>
            ) : (
              filteredDocumentTypes.map((type) => (
                <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-gray-500">
                        <FileText className="inline-block h-3 w-3 mr-1" />
                        {type.documentsCount} documentos
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
                            setSelectedDocumentType(type)
                            setShowDocumentTypeModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDocumentTypeToDelete(type)
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
            <AlertDialogTitle>Tem certeza que deseja excluir este tipo de documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente o tipo de documento{" "}
              <span className="font-semibold">{documentTypeToDelete?.name}</span> e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocumentType} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function DocumentTypeForm({ documentType, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: documentType?.id || null,
    name: documentType?.name || "",
  })

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Tipo de Documento</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Política"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>{documentType ? "Salvar Alterações" : "Criar Tipo de Documento"}</Button>
      </div>
    </div>
  )
}
