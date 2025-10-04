"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  CheckCircle,
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

import { getUsers, updateUser, deleteUser } from "@/app/admin/actions"

// Função para gerar iniciais do nome completo
const getInitials = (fullName: string) => {
  const names = fullName.trim().split(" ")
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase()
  }
  return (names[0][0] + names[names.length - 1][0]).toUpperCase()
}

const roleColors = {
  Administrador: "bg-red-100 text-red-800",
  Gerente: "bg-blue-100 text-blue-800",
  Aprovador: "bg-green-100 text-green-800",
  Usuário: "bg-gray-100 text-gray-800",
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
}

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const data = await getUsers()
    setUsers(data)
    setLoading(false)
  }

  const handleSaveUser = async (userData) => {
    try {
      if (userData.id) {
        const result = await updateUser(userData.id, userData)
        if (result.success) {
          toast({
            title: "Usuário atualizado",
            description: "O usuário foi atualizado com sucesso.",
          })
          await loadUsers()
        } else {
          toast({
            title: "Erro ao atualizar usuário",
            description: result.error,
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Novo usuário",
          description: "Para criar novos usuários, use a funcionalidade de convite por email.",
        })
      }
      setShowUserModal(false)
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o usuário.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async () => {
    try {
      const result = await deleteUser(userToDelete.id)
      if (result.success) {
        toast({
          title: "Usuário desativado",
          description: "O usuário foi desativado com sucesso.",
        })
        await loadUsers()
      } else {
        toast({
          title: "Erro ao desativar usuário",
          description: result.error,
          variant: "destructive",
        })
      }
      setShowDeleteConfirm(false)
      setUserToDelete(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao desativar o usuário.",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    admins: users.filter((u) => u.role === "Administrador").length,
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
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
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
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedUser(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
                </DialogHeader>
                <UserForm user={selectedUser} onSave={handleSaveUser} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                {searchTerm ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum usuário encontrado</h3>
                    <p className="text-gray-500 mb-4">
                      Não encontramos usuários que correspondam à sua busca "{searchTerm}"
                    </p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Limpar busca
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum usuário cadastrado</h3>
                    <p className="text-gray-500 mb-4">Comece adicionando o primeiro usuário à plataforma</p>
                    <Button onClick={() => setShowUserModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Primeiro Usuário
                    </Button>
                  </>
                )}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder-icon.png?height=48&width=48&text=${getInitials(user.name)}`} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </span>
                        <span>{user.department}</span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Último login: {user.lastLogin}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={roleColors[user.role]}>{user.role}</Badge>
                    <Badge className={statusColors[user.status]}>
                      {user.status === "active" ? "Ativo" : "Inativo"}
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
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setShowPermissionsModal(true)
                          }}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Permissões
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setUserToDelete(user)
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

      {/* Permissions Modal */}
      <Dialog open={showPermissionsModal} onOpenChange={setShowPermissionsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Permissões - {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <PermissionsForm user={selectedUser} onSave={() => setShowPermissionsModal(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir este usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente o usuário{" "}
              <span className="font-semibold">{userToDelete?.name}</span> e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function UserForm({ user, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "Usuário",
    department: user?.department || "",
    status: user?.status || "active",
  })
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSave = async () => {
    if (!user) {
      // Novo usuário - mostrar confirmação de email
      setShowEmailConfirmation(true)
    } else {
      // Usuário existente - salvar diretamente
      onSave(formData) // Chamar o onSave passado
    }
  }

  const handleSendEmail = async () => {
    setEmailSending(true)

    // Simular envio de email
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setEmailSending(false)
    setEmailSent(true)

    // Aguardar um pouco e então salvar o usuário
    setTimeout(() => {
      onSave(formData) // Chamar o onSave passado com os dados do formulário
    }, 1500)
  }

  return (
    <div className="space-y-4">
      {!showEmailConfirmation ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: João Silva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="usuario@empresa.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Usuário">Usuário</SelectItem>
                  <SelectItem value="Aprovador">Aprovador</SelectItem>
                  <SelectItem value="Gerente">Gerente</SelectItem>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Diretoria">Diretoria</SelectItem>
                  <SelectItem value="Operações">Operações</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === "active"}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
              }
            />
            <Label htmlFor="status">Usuário ativo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onSave}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{user ? "Salvar Alterações" : "Criar Usuário"}</Button>
          </div>
        </>
      ) : (
        <EmailConfirmationStep
          userData={formData}
          emailSending={emailSending}
          emailSent={emailSent}
          onSendEmail={handleSendEmail}
          onCancel={() => setShowEmailConfirmation(false)}
        />
      )}
    </div>
  )
}

function EmailConfirmationStep({ userData, emailSending, emailSent, onSendEmail, onCancel }) {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          {emailSent ? (
            <CheckCircle className="h-8 w-8 text-green-600" />
          ) : emailSending ? (
            <Mail className="h-8 w-8 text-blue-600 animate-pulse" />
          ) : (
            <Mail className="h-8 w-8 text-blue-600" />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold">
            {emailSent ? "Email Enviado!" : emailSending ? "Enviando Email..." : "Confirmar Criação de Usuário"}
          </h3>
          <p className="text-gray-600 mt-2">
            {emailSent ? (
              <>
                Um email foi enviado para <strong>{userData.email}</strong> com instruções para criar a senha de acesso.
                <br />O usuário será criado no sistema.
              </>
            ) : emailSending ? (
              "Enviando email com instruções para criação de senha..."
            ) : (
              <>
                Será enviado um email para <strong>{userData.email}</strong> com instruções para que o usuário crie sua
                própria senha de acesso.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Resumo do Usuário:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Nome:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Função:</strong> {userData.role}
          </p>
          <p>
            <strong>Departamento:</strong> {userData.department}
          </p>
        </div>
      </div>

      {!emailSent && !emailSending && (
        <div className="flex justify-center space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Voltar
          </Button>
          <Button onClick={onSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Enviar Email e Criar Usuário
          </Button>
        </div>
      )}

      {emailSending && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Processando...</span>
        </div>
      )}
    </div>
  )
}

function PermissionsForm({ user, onSave }) {
  const [permissions, setPermissions] = useState({
    read: user?.permissions?.includes("read") || false,
    write: user?.permissions?.includes("write") || false,
    approve: user?.permissions?.includes("approve") || false,
    admin: user?.permissions?.includes("admin") || false,
  })

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Visualizar Documentos</Label>
            <p className="text-sm text-gray-500">Permite visualizar documentos</p>
          </div>
          <Switch
            checked={permissions.read}
            onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, read: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Criar/Editar Documentos</Label>
            <p className="text-sm text-gray-500">Permite criar e editar documentos</p>
          </div>
          <Switch
            checked={permissions.write}
            onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, write: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Aprovar Documentos</Label>
            <p className="text-sm text-gray-500">Permite aprovar ou rejeitar documentos</p>
          </div>
          <Switch
            checked={permissions.approve}
            onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, approve: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Administração</Label>
            <p className="text-sm text-gray-500">Acesso total ao sistema</p>
          </div>
          <Switch
            checked={permissions.admin}
            onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, admin: checked }))}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onSave}>
          Cancelar
        </Button>
        <Button onClick={onSave}>Salvar Permissões</Button>
      </div>
    </div>
  )
}
