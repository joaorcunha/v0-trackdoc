"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Bell, AlertTriangle } from "lucide-react"
import { getNotifications, markNotificationAsRead, deleteNotification } from "@/app/admin/actions"
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
  type: string
  user_id: string
  company_id: string
  entity_type: string | null
  entity_id: string | null
  created_at: string
  read: boolean
}

export default function NotificationManagement() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("Erro ao carregar notificações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notificações.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsRead(id)
    if (result.success) {
      toast({
        title: "Sucesso",
        description: "Notificação marcada como lida.",
      })
      loadNotifications()
    } else {
      toast({
        title: "Erro",
        description: result.error || "Não foi possível marcar a notificação como lida.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteNotification(id)
    if (result.success) {
      toast({
        title: "Sucesso",
        description: "Notificação excluída com sucesso.",
      })
      loadNotifications()
    } else {
      toast({
        title: "Erro",
        description: result.error || "Não foi possível excluir a notificação.",
        variant: "destructive",
      })
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

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Notificações</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Não Lidas</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter((n) => !n.read).length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lidas</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter((n) => n.read).length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Bell className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotifications = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Carregando notificações...</p>
        </div>
      )
    }

    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg font-medium">Nenhuma notificação encontrada</p>
          <p className="text-gray-400 text-sm">As notificações aparecerão aqui quando forem criadas</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <Badge className={getTypeColor(notification.type)}>
                      {notification.type === "info" && "Info"}
                      {notification.type === "warning" && "Aviso"}
                      {notification.type === "error" && "Erro"}
                      {notification.type === "success" && "Sucesso"}
                    </Badge>
                    {!notification.read && <Badge variant="default">Nova</Badge>}
                  </div>
                  <p className="text-gray-600 mb-3">{notification.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Criada: {new Date(notification.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                      Marcar como lida
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Excluir
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
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(notification.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
          <Card>
            <CardHeader>
              <CardTitle>Notificações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500 text-center py-4">Carregando...</p>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Nenhuma notificação encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Bell className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type === "info" && "Info"}
                        {notification.type === "warning" && "Aviso"}
                        {notification.type === "error" && "Erro"}
                        {notification.type === "success" && "Sucesso"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">{renderNotifications()}</TabsContent>
      </Tabs>
    </div>
  )
}
