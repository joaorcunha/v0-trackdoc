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
import { useRouter } from "next/navigation"
import { createDocumentType, updateDocumentType, deleteDocumentType } from "@/app/admin/actions"
import {
  Tag,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  SwitchCameraIcon as Switch,
  TextIcon as Textarea,
  LayoutGrid,
  List,
} from "lucide-react"

/* ---------- TIPOS ---------- */
type Status = "active" | "inactive"

interface DocumentType {
  id: number
  name: string
  description: string | null
  prefix: string
  color: string
  requiredFields: string[]
  approvalRequired: boolean
  retentionPeriod: number
  status: Status
  template: string | null
  documentsCount: number // Assumindo que este campo virá do banco ou será calculado
}

/* ---------- CONSTANTES ---------- */
const colorOptions = [
  { value: "blue", label: "Azul", class: "bg-blue-100 text-blue-800" },
  { value: "green", label: "Verde", class: "bg-green-100 text-green-800" },
  { value: "yellow", label: "Amarelo", class: "bg-yellow-100 text-yellow-800" },
  { value: "purple", label: "Roxo", class: "bg-purple-100 text-purple-800" },
  { value: "red", label: "Vermelho", class: "bg-red-100 text-red-800" },
  { value: "gray", label: "Cinza", class: "bg-gray-100 text-gray-800" },
  { value: "orange", label: "Laranja", class: "bg-orange-100 text-orange-800" },
  { value: "teal", label: "Verde-azulado", class: "bg-teal-100 text-teal-800" },
  { value: "cyan", label: "Ciano", class: "bg-cyan-100 text-cyan-800" },
  { value: "lime", label: "Verde-limão", class: "bg-lime-100 text-lime-800" },
]

const statusColors: Record<Status, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
}

const availableFields = [
  { key: "title", label: "Título" },
  { key: "author", label: "Autor" },
  { key: "version", label: "Versão" },
  { key: "sector", label: "Setor" },
  { key: "category", label: "Categoria" },
  { key: "description", label: "Descrição" },
  { key: "tags", label: "Tags" },
  { key: "date", label: "Data" },
  { key: "period", label: "Período" },
  { key: "participants", label: "Participantes" },
  { key: "decisions", label: "Decisões" },
  { key: "steps", label: "Etapas" },
]

/* ---------- PROPS ---------- */
interface DocumentTypeManagementProps {
  initialDocumentTypes: DocumentType[]
}

/* ---------- COMPONENTE PRINCIPAL ---------- */
export default function DocumentTypeManagement({ initialDocumentTypes = [] }: DocumentTypeManagementProps) {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(initialDocumentTypes)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [typeToDelete, setTypeToDelete] = useState<DocumentType | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const router = useRouter()

  // Atualiza o estado local quando initialDocumentTypes muda (após revalidação do servidor)
  useEffect(() => {
    // Only update if the arrays are actually different
    if (JSON.stringify(documentTypes) !== JSON.stringify(initialDocumentTypes)) {
      setDocumentTypes(initialDocumentTypes)
    }
  }, [initialDocumentTypes, documentTypes])

  /* --------- DERIVADOS --------- */
  const filteredTypes = documentTypes.filter((type) => type.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  const stats = {
    total: documentTypes.length,
    active: documentTypes.filter((t) => t.status === "active").length,
    inactive: documentTypes.filter((t) => t.status === "inactive").length,
    totalDocuments: documentTypes.reduce((sum, t) => sum + (t.documentsCount ?? 0), 0),
  }

  /* --------- HANDLERS --------- */
  const handleSaveDocumentType = async (typeData: Partial<DocumentType>) => {
    let result
    if (typeData.id) {
      result = await updateDocumentType(typeData.id, typeData)
    } else {
      result = await createDocumentType(typeData as Omit<DocumentType, "id">)
    }

    if (result.success) {
      router.refresh() // Revalida o cache e busca os dados atualizados do servidor
      setShowTypeModal(false)
      setSelectedType(null)
    } else {
      console.error("Falha ao salvar tipo de documento:", result.error)
      // TODO: Adicionar feedback de erro para o usuário
    }
  }

  const handleDeleteDocumentType = async () => {
    if (!typeToDelete) return

    const result = await deleteDocumentType(typeToDelete.id)
    if (result.success) {
      router.refresh() // Revalida o cache e busca os dados atualizados do servidor
      setShowDeleteConfirm(false)
      setTypeToDelete(null)
    } else {
      console.error("Falha ao deletar tipo de documento:", result.error)
      // TODO: Adicionar feedback de erro para o usuário
    }
  }

  /* --------- RENDER --------- */
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos de Documento</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos Inativos</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
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
                  placeholder="Buscar tipos de documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Dialog open={showTypeModal} onOpenChange={setShowTypeModal}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedType(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Tipo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{selectedType ? "Editar Tipo de Documento" : "Novo Tipo de Documento"}</DialogTitle>
                  </DialogHeader>
                  <DocumentTypeForm documentType={selectedType} onSave={handleSaveDocumentType} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "grid" ? (
        /* Document Types Grid */
        <div className="grid grid-cols-1 lg:col-span-3 xl:grid-cols-3 gap-6">
          {filteredTypes.map((type) => (
            <Card key={type.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        colorOptions.find((c) => c.value === type.color)?.class
                      }`}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <p className="text-sm text-gray-500">Prefixo: {type.prefix}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={statusColors[type.status]}>
                      {type.status === "active" ? "Ativo" : "Inativo"}
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
                            setSelectedType(type)
                            setShowTypeModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setTypeToDelete(type)
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
                  <p className="text-sm text-gray-600">{type.description}</p>

                  <div>
                    <p className="text-sm font-medium mb-2">Campos Obrigatórios:</p>
                    <div className="flex flex-wrap gap-1">
                      {type.requiredFields?.map((fieldKey) => {
                        const field = availableFields.find((f) => f.key === fieldKey)
                        return (
                          <Badge key={fieldKey} variant="outline" className="text-xs">
                            {field ? field.label : fieldKey}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Aprovação:</p>
                      <p className={type.approvalRequired ? "text-green-600" : "text-gray-500"}>
                        {type.approvalRequired ? "Obrigatória" : "Não obrigatória"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Retenção:</p>
                      <p className="text-gray-600">{type.retentionPeriod} meses</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                    <span>{type.documentsCount} documentos</span>
                    <span>Template: {type.template ? "Sim" : "Não"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Document Types List */
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredTypes.map((type, index) => (
                <div key={type.id} className={`p-4 ${index !== filteredTypes.length - 1 ? "border-b" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          colorOptions.find((c) => c.value === type.color)?.class
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h3 className="font-medium text-lg">{type.name}</h3>
                          <Badge className={statusColors[type.status]} variant="secondary">
                            {type.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mt-1">
                          <span>Prefixo: {type.prefix}</span>
                          <span>{type.documentsCount} documentos</span>
                          <span>Retenção: {type.retentionPeriod} meses</span>
                          <span className={type.approvalRequired ? "text-green-600" : "text-gray-500"}>
                            {type.approvalRequired ? "Aprovação obrigatória" : "Sem aprovação"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
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
                            setSelectedType(type)
                            setShowTypeModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setTypeToDelete(type)
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
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir este tipo de documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente o tipo de documento{" "}
              <span className="font-semibold">{typeToDelete?.name}</span> e todos os seus dados associados.
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

/* ---------- COMPONENTE DE FORMULÁRIO ---------- */
interface DocumentTypeFormProps {
  documentType: DocumentType | null
  onSave: (data: Partial<DocumentType>) => void
}

function DocumentTypeForm({ documentType, onSave }: DocumentTypeFormProps) {
  const [formData, setFormData] = useState<Partial<DocumentType>>({
    name: documentType?.name || "",
    description: documentType?.description || "",
    prefix: documentType?.prefix || "",
    color: documentType?.color || "blue",
    requiredFields: documentType?.requiredFields || ["title", "author"],
    approvalRequired: documentType?.approvalRequired || false,
    retentionPeriod: documentType?.retentionPeriod || 24,
    status: documentType?.status || "active",
    template: documentType?.template || null,
    ...(documentType && { id: documentType.id }), // Adiciona o ID se for edição
  })

  const toggleRequiredField = (fieldKey: string) => {
    setFormData((prev) => {
      const currentFields = prev.requiredFields || []
      return {
        ...prev,
        requiredFields: currentFields.includes(fieldKey)
          ? currentFields.filter((f) => f !== fieldKey)
          : [...currentFields, fieldKey],
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Tipo</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Política"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prefix">Prefixo</Label>
          <Input
            id="prefix"
            value={formData.prefix || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, prefix: e.target.value.toUpperCase() }))}
            placeholder="Ex: POL"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Descreva o propósito deste tipo de documento"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Cor</Label>
          <Select
            value={formData.color || "blue"}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
          >
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
        <div className="space-y-2">
          <Label htmlFor="retention">Período de Retenção (meses)</Label>
          <Input
            id="retention"
            type="number"
            value={formData.retentionPeriod || 0}
            onChange={(e) => setFormData((prev) => ({ ...prev, retentionPeriod: Number.parseInt(e.target.value) }))}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Campos Obrigatórios</Label>
        <div className="grid grid-cols-3 gap-2">
          {availableFields.map((field) => (
            <div key={field.key} className="flex items-center space-x-2">
              <Switch
                checked={formData.requiredFields?.includes(field.key) || false}
                onCheckedChange={() => toggleRequiredField(field.key)}
              />
              <Label className="text-sm">{field.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.approvalRequired || false}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, approvalRequired: checked }))}
        />
        <Label>Aprovação obrigatória</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.status === "active"}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))}
        />
        <Label>Tipo ativo</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={() => onSave(formData)}>
          Cancelar
        </Button>
        <Button onClick={() => onSave(formData)}>Salvar Tipo</Button>
      </div>
    </div>
  )
}
