"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Bell,
  Mail,
  MessageSquare,
  AlertTriangle,
  Clock,
  Send,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Download,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  priority: "low" | "medium" | "high" | "urgent"
  recipients: string[]
  channels: ("email" | "push" | "sms")[]
  status: "draft" | "scheduled" | "sent" | "failed"
  createdAt: string
  scheduledFor?: string
  sentAt?: string
  readCount: number
  totalRecipients: number
}

interface NotificationTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: "approval" | "deadline" | "system" | "custom"
  variables: string[]
  isActive: boolean
}

interface NotificationSettings {
  emailEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
  digestFrequency: "immediate" | "hourly" | "daily" | "weekly"
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  autoApprovalReminders: boolean
  deadlineAlerts: boolean
  systemMaintenance: boolean
}

export default function NotificationManagement() {
  const { toast } = useToast()

  // All hooks must be called in the same order every time
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)

  const initialNotifications: Notification[] = [
    {
      id: "1",
      title: "Documentos Pendentes de Aprovação",
      message: "Você tem 5 documentos aguardando aprovação há mais de 2 dias.",
      type: "warning",
      priority: "high",
      recipients: ["admin@empresa.com", "gestor@empresa.com"],
      channels: ["email", "push"],
      status: "sent",
      createdAt: "2024-01-15T10:30:00Z",
      sentAt: "2024-01-15T10:35:00Z",
      readCount: 2,
      totalRecipients: 2,
    },
    {
      id: "2",
      title: "Manutenção Programada do Sistema",
      message: "O sistema estará em manutenção no domingo das 02:00 às 06:00.",
      type: "info",
      priority: "medium",
      recipients: ["todos@empresa.com"],
      channels: ["email", "push"],
      status: "scheduled",
      createdAt: "2024-01-14T15:00:00Z",
      scheduledFor: "2024-01-20T08:00:00Z",
      readCount: 0,
      totalRecipients: 45,
    },
    {
      id: "3",
      title: "Prazo de Documento Vencendo",
      message: "O documento 'Contrato de Fornecimento' vence em 24 horas.",
      type: "error",
      priority: "urgent",
      recipients: ["juridico@empresa.com"],
      channels: ["email", "push", "sms"],
      status: "sent",
      createdAt: "2024-01-16T09:00:00Z",
      sentAt: "2024-01-16T09:05:00Z",
      readCount: 1,
      totalRecipients: 1,
    },
  ]

  const initialTemplates: NotificationTemplate[] = [
    {
      id: "1",
      name: "Lembrete de Aprovação",
      subject: "Documentos Pendentes - {{count}} itens aguardando",
      content: "Olá {{userName}}, você tem {{count}} documentos aguardando aprovação há mais de {{days}} dias.",
      type: "approval",
      variables: ["userName", "count", "days"],
      isActive: true,
    },
    {
      id: "2",
      name: "Prazo Vencendo",
      subject: "URGENTE: Documento {{documentName}} vence em {{hours}} horas",
      content: "O documento {{documentName}} está próximo do vencimento. Prazo: {{deadline}}",
      type: "deadline",
      variables: ["documentName", "hours", "deadline"],
      isActive: true,
    },
    {
      id: "3",
      name: "Manutenção do Sistema",
      subject: "Manutenção Programada - {{date}}",
      content: "O sistema estará indisponível para manutenção de {{startTime}} às {{endTime}}.",
      type: "system",
      variables: ["date", "startTime", "endTime"],
      isActive: false,
    },
  ]

  const [notifications] = useState<Notification[]>(initialNotifications)
  const [templates, setTemplates] = useState<NotificationTemplate[]>(initialTemplates)
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    digestFrequency: "daily",
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00",
    },
    autoApprovalReminders: true,
    deadlineAlerts: true,
    systemMaintenance: true,
  })

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as const,
    priority: "medium" as const,
    recipients: "",
    channels: ["email"] as ("email" | "push" | "sms")[],
    scheduledFor: "",
  })

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    content: "",
    type: "custom" as const,
    variables: "",
  })

  const handleTemplateToggle = (templateId: string, newActiveState: boolean) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template.id === templateId ? { ...template, isActive: newActiveState } : template,
      ),
    )

    toast({
      title: newActiveState ? "Template ativado" : "Template desativado",
      description: `O template foi ${newActiveState ? "ativado" : "desativado"} com sucesso.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateNotification = () => {
    // Validação básica
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Erro",
        description: "Título e mensagem são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Notificação criada",
      description: "A notificação foi criada com sucesso.",
    })

    setIsCreateModalOpen(false)
    setNewNotification({
      title: "",
      message: "",
      type: "info",
      priority: "medium",
      recipients: "",
      channels: ["email"],
      scheduledFor: "",
    })
  }

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      toast({
        title: "Erro",
        description: "Nome, assunto e conteúdo são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Template criado",
      description: "O template foi criado com sucesso.",
    })

    setIsTemplateModalOpen(false)
    setNewTemplate({
      name: "",
      subject: "",
      content: "",
      type: "custom",
      variables: "",
    })
  }

  const handleUpdateSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de notificação foram atualizadas.",
    })
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || notification.status === filterStatus
    const matchesType = filterType === "all" || notification.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Enviadas</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">+12% em relação ao mês anterior</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Abertura</p>
              <p className="text-2xl font-bold text-gray-900">87.5%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">+5.2% em relação ao mês anterior</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendadas</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Para os próximos 7 dias</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Falhas</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">-2 em relação ao mês anterior</p>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-6">
      {/* Filtros e Ações */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar notificações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="sent">Enviadas</SelectItem>
              <SelectItem value="scheduled">Agendadas</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="failed">Falhas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="info">Informação</SelectItem>
              <SelectItem value="warning">Aviso</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Notificação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Notificação</DialogTitle>
                <DialogDescription>Crie uma nova notificação para enviar aos usuários.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                      placeholder="Título da notificação"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={newNotification.type}
                      onValueChange={(value: any) => setNewNotification({ ...newNotification, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Informação</SelectItem>
                        <SelectItem value="warning">Aviso</SelectItem>
                        <SelectItem value="error">Erro</SelectItem>
                        <SelectItem value="success">Sucesso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    placeholder="Conteúdo da notificação"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select
                      value={newNotification.priority}
                      onValueChange={(value: any) => setNewNotification({ ...newNotification, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipients">Destinatários</Label>
                    <Input
                      id="recipients"
                      value={newNotification.recipients}
                      onChange={(e) => setNewNotification({ ...newNotification, recipients: e.target.value })}
                      placeholder="emails separados por vírgula"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Canais de Envio</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email"
                        checked={newNotification.channels.includes("email")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewNotification({ ...newNotification, channels: [...newNotification.channels, "email"] })
                          } else {
                            setNewNotification({
                              ...newNotification,
                              channels: newNotification.channels.filter((c) => c !== "email"),
                            })
                          }
                        }}
                      />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="push"
                        checked={newNotification.channels.includes("push")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewNotification({ ...newNotification, channels: [...newNotification.channels, "push"] })
                          } else {
                            setNewNotification({
                              ...newNotification,
                              channels: newNotification.channels.filter((c) => c !== "push"),
                            })
                          }
                        }}
                      />
                      <Label htmlFor="push">Push</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sms"
                        checked={newNotification.channels.includes("sms")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewNotification({ ...newNotification, channels: [...newNotification.channels, "sms"] })
                          } else {
                            setNewNotification({
                              ...newNotification,
                              channels: newNotification.channels.filter((c) => c !== "sms"),
                            })
                          }
                        }}
                      />
                      <Label htmlFor="sms">SMS</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledFor">Agendar Para (opcional)</Label>
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    value={newNotification.scheduledFor}
                    onChange={(e) => setNewNotification({ ...newNotification, scheduledFor: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateNotification}>Criar Notificação</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status === "sent" && "Enviada"}
                      {notification.status === "scheduled" && "Agendada"}
                      {notification.status === "draft" && "Rascunho"}
                      {notification.status === "failed" && "Falha"}
                    </Badge>
                    <Badge className={getTypeColor(notification.type)}>
                      {notification.type === "info" && "Info"}
                      {notification.type === "warning" && "Aviso"}
                      {notification.type === "error" && "Erro"}
                      {notification.type === "success" && "Sucesso"}
                    </Badge>
                    <Badge className={getPriorityColor(notification.priority)}>
                      {notification.priority === "low" && "Baixa"}
                      {notification.priority === "medium" && "Média"}
                      {notification.priority === "high" && "Alta"}
                      {notification.priority === "urgent" && "Urgente"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{notification.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Criada: {new Date(notification.createdAt).toLocaleDateString()}</span>
                    {notification.sentAt && <span>Enviada: {new Date(notification.sentAt).toLocaleDateString()}</span>}
                    {notification.scheduledFor && (
                      <span>Agendada: {new Date(notification.scheduledFor).toLocaleDateString()}</span>
                    )}
                    <span>Destinatários: {notification.totalRecipients}</span>
                    {notification.status === "sent" && (
                      <span>
                        Lidas: {notification.readCount}/{notification.totalRecipients}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {notification.channels.map((channel) => (
                      <Badge key={channel} variant="outline" className="text-xs">
                        {channel === "email" && <Mail className="h-3 w-3 mr-1" />}
                        {channel === "push" && <Bell className="h-3 w-3 mr-1" />}
                        {channel === "sms" && <MessageSquare className="h-3 w-3 mr-1" />}
                        {channel.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Notificação</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Templates de Notificação</h3>
          <p className="text-gray-600">Gerencie templates reutilizáveis para notificações</p>
        </div>
        <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Template</DialogTitle>
              <DialogDescription>Crie um template reutilizável para notificações.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Nome do Template</Label>
                  <Input
                    id="templateName"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="Nome do template"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateType">Tipo</Label>
                  <Select
                    value={newTemplate.type}
                    onValueChange={(value: any) => setNewTemplate({ ...newTemplate, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approval">Aprovação</SelectItem>
                      <SelectItem value="deadline">Prazo</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateSubject">Assunto</Label>
                <Input
                  id="templateSubject"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  placeholder="Assunto do template (use {{variavel}} para variáveis)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateContent">Conteúdo</Label>
                <Textarea
                  id="templateContent"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  placeholder="Conteúdo do template (use {{variavel}} para variáveis)"
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateVariables">Variáveis Disponíveis</Label>
                <Input
                  id="templateVariables"
                  value={newTemplate.variables}
                  onChange={(e) => setNewTemplate({ ...newTemplate, variables: e.target.value })}
                  placeholder="Variáveis separadas por vírgula (ex: userName, count, date)"
                />
                <p className="text-xs text-gray-500">Use {{}} no assunto e conteúdo para inserir variáveis dinâmicas</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTemplateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTemplate}>Criar Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                    <Badge variant="outline">
                      {template.type === "approval" && "Aprovação"}
                      {template.type === "deadline" && "Prazo"}
                      {template.type === "system" && "Sistema"}
                      {template.type === "custom" && "Personalizado"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Assunto:</strong> {template.subject}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">{template.content}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Variáveis:</span>
                    {template.variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={template.isActive}
                    onCheckedChange={(checked) => handleTemplateToggle(template.id, checked)}
                  />
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Template</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Configurações de Notificação</h3>
        <p className="text-gray-600">Configure como e quando as notificações são enviadas</p>
      </div>

      <div className="grid gap-6">
        {/* Canais de Notificação */}
        <Card>
          <CardHeader>
            <CardTitle>Canais de Notificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-enabled">Notificações por Email</Label>
                <p className="text-sm text-gray-500">Enviar notificações via email</p>
              </div>
              <Switch
                id="email-enabled"
                checked={settings.emailEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, emailEnabled: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-enabled">Notificações Push</Label>
                <p className="text-sm text-gray-500">Enviar notificações push no navegador</p>
              </div>
              <Switch
                id="push-enabled"
                checked={settings.pushEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, pushEnabled: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-enabled">Notificações SMS</Label>
                <p className="text-sm text-gray-500">Enviar notificações via SMS (apenas urgentes)</p>
              </div>
              <Switch
                id="sms-enabled"
                checked={settings.smsEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, smsEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Frequência de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle>Frequência de Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="digest-frequency">Frequência do Resumo</Label>
              <Select
                value={settings.digestFrequency}
                onValueChange={(value: any) => setSettings({ ...settings, digestFrequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Imediato</SelectItem>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Controla com que frequência os resumos de notificação são enviados
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Horário Silencioso */}
        <Card>
          <CardHeader>
            <CardTitle>Horário Silencioso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quiet-hours">Ativar Horário Silencioso</Label>
                <p className="text-sm text-gray-500">Não enviar notificações durante determinado período</p>
              </div>
              <Switch
                id="quiet-hours"
                checked={settings.quietHours.enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    quietHours: { ...settings.quietHours, enabled: checked },
                  })
                }
              />
            </div>
            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Início</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        quietHours: { ...settings.quietHours, start: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">Fim</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        quietHours: { ...settings.quietHours, end: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notificações Automáticas */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações Automáticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-approval">Lembretes de Aprovação</Label>
                <p className="text-sm text-gray-500">Enviar lembretes automáticos para aprovações pendentes</p>
              </div>
              <Switch
                id="auto-approval"
                checked={settings.autoApprovalReminders}
                onCheckedChange={(checked) => setSettings({ ...settings, autoApprovalReminders: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="deadline-alerts">Alertas de Prazo</Label>
                <p className="text-sm text-gray-500">Enviar alertas quando documentos estão próximos do vencimento</p>
              </div>
              <Switch
                id="deadline-alerts"
                checked={settings.deadlineAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, deadlineAlerts: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="system-maintenance">Manutenção do Sistema</Label>
                <p className="text-sm text-gray-500">Notificar sobre manutenções programadas</p>
              </div>
              <Switch
                id="system-maintenance"
                checked={settings.systemMaintenance}
                onCheckedChange={(checked) => setSettings({ ...settings, systemMaintenance: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleUpdateSettings}>Salvar Configurações</Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()} • {notification.totalRecipients}{" "}
                        destinatários
                      </p>
                    </div>
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status === "sent" && "Enviada"}
                      {notification.status === "scheduled" && "Agendada"}
                      {notification.status === "draft" && "Rascunho"}
                      {notification.status === "failed" && "Falha"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">{renderNotifications()}</TabsContent>

        <TabsContent value="templates">{renderTemplates()}</TabsContent>

        <TabsContent value="settings">{renderSettings()}</TabsContent>
      </Tabs>
    </div>
  )
}
