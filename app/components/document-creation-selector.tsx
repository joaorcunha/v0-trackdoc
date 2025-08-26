"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Sparkles } from "lucide-react"

interface DocumentCreationSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectOption: (option: "upload" | "manual" | "ai") => void
}

export default function DocumentCreationSelector({
  open,
  onOpenChange,
  onSelectOption,
}: DocumentCreationSelectorProps) {
  const creationOptions = [
    {
      id: "upload",
      title: "Carregar Documento",
      description: "Faça upload de um arquivo existente e preencha os metadados",
      icon: Upload,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      features: ["Upload de arquivos", "Metadados completos", "Fluxo de aprovação"],
    },
    {
      id: "manual",
      title: "Criar Manualmente",
      description: "Crie um documento diretamente na plataforma usando o editor integrado",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      features: ["Editor integrado", "Templates prontos", "Fluxo de aprovação"],
    },
    {
      id: "ai",
      title: "Criar com IA",
      description: "Use inteligência artificial para gerar documentos profissionais",
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: ["Geração automática", "Templates inteligentes", "Fluxo de aprovação"],
    },
  ]

  const handleOptionSelect = (optionId: "upload" | "manual" | "ai") => {
    onSelectOption(optionId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Como você deseja criar o documento?</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {creationOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${option.borderColor}`}
                onClick={() => handleOptionSelect(option.id as "upload" | "manual" | "ai")}
              >
                <CardHeader className={`text-center ${option.bgColor}`}>
                  <div className="flex justify-center mb-3">
                    <Icon className={`h-12 w-12 ${option.color}`} />
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription className="text-sm">{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full ${option.color.replace("text-", "bg-")} mr-2`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-4 ${option.color.replace("text-", "bg-")} hover:opacity-90`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOptionSelect(option.id as "upload" | "manual" | "ai")
                    }}
                  >
                    Selecionar
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
