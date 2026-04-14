"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FileText, FileSpreadsheet, Presentation, Save, X, File } from "lucide-react"

interface DocumentModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  document?: any
  onSave: (document: any) => void
}

// Simulação de contadores de documentos por tipo para o ano atual
const getCurrentYear = () => new Date().getFullYear()

// Função para obter o próximo número sequencial para um tipo de documento
const getNextDocumentNumber = (type: string, existingDocuments: any[] = []) => {
  if (!type) return ""

  const currentYear = getCurrentYear()

  // Mapear tipos para prefixos de 3 letras
  const typePrefix = {
    Política: "POL",
    Procedimento: "PRO",
    Relatório: "REL",
    Ata: "ATA",
    Manual: "MAN",
    Instrução: "INS",
    Formulário: "FOR",
    Norma: "NOR",
    Diretriz: "DIR",
  }

  const prefix = typePrefix[type] || type.substring(0, 3).toUpperCase()

  // Encontrar todos os documentos do mesmo tipo e ano
  const sameTypeDocuments = existingDocuments.filter((doc) => {
    if (!doc.number) return false
    const parts = doc.number.split("-")
    return parts.length === 3 && parts[0] === prefix && parts[1] === currentYear.toString()
  })

  // Extrair os números sequenciais e encontrar o próximo
  const sequenceNumbers = sameTypeDocuments
    .map((doc) => {
      const parts = doc.number.split("-")
      return Number.parseInt(parts[2]) || 0
    })
    .filter((num) => !isNaN(num))

  const nextSequence = sequenceNumbers.length > 0 ? Math.max(...sequenceNumbers) + 1 : 1

  return `${prefix}-${currentYear}-${nextSequence.toString().padStart(3, "0")}`
}

// Função para obter usuário atual (simulado)
const getCurrentUser = () => {
  return {
    name: "Usuário Teste", // Nome de usuário genérico
    email: "usuario.teste@empresa.com", // Email genérico
    role: "Usuário", // Função genérica
  }
}

// Tipos de arquivo suportados
const fileTypes = [
  { value: "word", label: "Word Document", icon: FileText, accept: ".doc,.docx", color: "text-blue-600" },
  { value: "excel", label: "Excel Spreadsheet", icon: FileSpreadsheet, accept: ".xls,.xlsx", color: "text-green-600" },
  {
    value: "powerpoint",
    label: "PowerPoint Presentation",
    icon: Presentation,
    accept: ".ppt,.pptx",
    color: "text-orange-600",
  },
  { value: "pdf", label: "PDF Document", icon: File, accept: ".pdf", color: "text-red-600" },
]

export default function DocumentModal({ isOpen, onClose, document: initialDocument, onSave }: DocumentModalProps) {
  const [document, setDocument] = useState(
    initialDocument || {
      title: "",
      content: "",
      category: "",
      department: "",
      documentType: "",
      workflow: "",
      fileUrl: "",
    },
  )

  useEffect(() => {
    setDocument(
      initialDocument || {
        title: "",
        content: "",
        category: "",
        department: "",
        documentType: "",
        workflow: "",
        fileUrl: "",
      },
    )
  }, [initialDocument])

  const handleChange = (e) => {
    const { id, value } = e.target
    setDocument((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id, value) => {
    setDocument((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(document)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {initialDocument ? "Editar Documento" : "Novo Documento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Documento</Label>
            <Input
              id="title"
              value={document.title}
              onChange={handleChange}
              placeholder="Ex: Política de Uso Aceitável"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={document.content}
              onChange={handleChange}
              placeholder="Digite o conteúdo do documento aqui..."
              rows={8}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={document.category} onValueChange={(val) => handleSelectChange("category", val)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Politicas Internas">Políticas Internas</SelectItem>
                  <SelectItem value="Relatorios">Relatórios</SelectItem>
                  <SelectItem value="Contratos">Contratos</SelectItem>
                  <SelectItem value="Manuais">Manuais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={document.department} onValueChange={(val) => handleSelectChange("department", val)}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <Select value={document.documentType} onValueChange={(val) => handleSelectChange("documentType", val)}>
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Politica">Política</SelectItem>
                  <SelectItem value="Procedimento">Procedimento</SelectItem>
                  <SelectItem value="Relatorio">Relatório</SelectItem>
                  <SelectItem value="Ata">Ata</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow">Fluxo de Aprovação</Label>
              <Select value={document.workflow} onValueChange={(val) => handleSelectChange("workflow", val)}>
                <SelectTrigger id="workflow">
                  <SelectValue placeholder="Selecione um fluxo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aprovacao Simples">Aprovação Simples</SelectItem>
                  <SelectItem value="Aprovacao Dupla">Aprovação Dupla</SelectItem>
                  <SelectItem value="Aprovacao Gerencial">Aprovação Gerencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileUrl">URL do Arquivo (Opcional)</Label>
            <Input
              id="fileUrl"
              value={document.fileUrl}
              onChange={handleChange}
              placeholder="https://exemplo.com/documento.pdf"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar Documento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
