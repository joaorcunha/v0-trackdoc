"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FileText,
  LayoutDashboard,
  CheckCircle,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Edit,
} from "lucide-react"
import { cn } from "@/lib/utils"
import LogoutButton from "./logout-button"
import QuickSearchModal from "./quick-search-modal"
import { getCurrentUser } from "@/app/admin/actions"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  pendingApprovalsCount: number
}

export default function Sidebar({ activeView, onViewChange, pendingApprovalsCount }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showQuickSearch, setShowQuickSearch] = useState(false)
  const [currentUser, setCurrentUser] = useState<{
    full_name: string
    role: string
    email: string
  } | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      console.log("[v0] Sidebar: Iniciando carregamento de dados do usuário")
      setIsLoadingUser(true)
      try {
        const user = await getCurrentUser()
        console.log("[v0] Sidebar: Dados do usuário recebidos:", user)
        if (user) {
          setCurrentUser({
            full_name: user.full_name,
            role: user.role === "admin" ? "Administrador" : user.role === "manager" ? "Gerente" : "Usuário",
            email: user.email,
          })
          console.log("[v0] Sidebar: Estado do usuário atualizado")
        } else {
          console.log("[v0] Sidebar: Nenhum usuário retornado")
        }
      } catch (error) {
        console.error("[v0] Sidebar: Erro ao carregar dados do usuário:", error)
      } finally {
        setIsLoadingUser(false)
      }
    }
    loadUserData()
  }, [])

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "documents",
      label: "Documentos",
      icon: FileText,
      badge: null,
    },
    {
      id: "editor",
      label: "Editor",
      icon: Edit,
      badge: null,
    },
    {
      id: "ai-create",
      label: "Criar com IA",
      icon: Sparkles,
      badge: "Novo",
    },
    {
      id: "approvals",
      label: "Aprovações",
      icon: CheckCircle,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount.toString() : null,
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: Bell,
      badge: "2",
    },
    {
      id: "admin",
      label: "Administração",
      icon: Settings,
      badge: null,
    },
  ]

  const getUserInitials = (name: string) => {
    const names = name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button variant="ghost" size="sm" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleMobileSidebar}>
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileSidebar} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50 h-screen",
          "fixed md:relative",
          isExpanded ? "w-64" : "w-16",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isExpanded && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">TrackDoc</h2>
                  <p className="text-xs text-gray-500">Gestão de Documentos</p>
                </div>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="hidden md:flex">
              {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40&text=User" />
              <AvatarFallback>{currentUser ? getUserInitials(currentUser.full_name) : "U"}</AvatarFallback>
            </Avatar>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                {isLoadingUser ? (
                  <>
                    <p className="text-sm font-medium text-gray-400 truncate">Carregando...</p>
                    <p className="text-xs text-gray-400 truncate">Aguarde</p>
                  </>
                ) : currentUser ? (
                  <>
                    <p className="text-sm font-medium text-gray-900 truncate">{currentUser.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-400 truncate">Usuário não encontrado</p>
                    <p className="text-xs text-gray-400 truncate">Erro ao carregar</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full transition-colors",
                    isExpanded ? "justify-start" : "justify-center",
                    isActive && "bg-blue-50 text-blue-700 border-blue-200",
                  )}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className={cn("h-4 w-4", isExpanded && "mr-3")} />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          {isExpanded && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Ações Rápidas</h3>
              <div className="space-y-1 p-2 bg-gray-50 rounded-lg border">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-white"
                  onClick={() => setShowQuickSearch(true)}
                >
                  <Search className="h-4 w-4 mr-3" />
                  Busca Rápida
                </Button>
                <Button
                  variant={activeView === "help" ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-white",
                    activeView === "help" && "bg-blue-50 text-blue-700 border-blue-200",
                  )}
                  onClick={() => onViewChange("help")}
                >
                  <HelpCircle className="h-4 w-4 mr-3" />
                  Ajuda
                </Button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100">
            <LogoutButton
              className={cn(
                "w-full text-red-600 hover:text-red-700 hover:bg-red-50",
                isExpanded ? "justify-start" : "justify-center",
              )}
              variant="ghost"
              size="sm"
              showIcon={true}
              showText={isExpanded}
            />
          </div>
        </div>
      </div>

      {/* Quick Search Modal */}
      <QuickSearchModal open={showQuickSearch} onOpenChange={setShowQuickSearch} />
    </>
  )
}
