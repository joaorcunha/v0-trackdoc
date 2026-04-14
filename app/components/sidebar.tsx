"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  FileText,
  Users,
  Folder,
  Clock,
  CheckCircle,
  Search,
  Mail,
  BarChart2,
  ClipboardCheck,
  ScrollText,
  GitPullRequest,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LogoutButton from "./logout-button"
import QuickSearchModal from "./quick-search-modal"
import EmailInvitationModal from "./email-invitation-modal"
import { Badge } from "@/components/ui/badge"

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return "??"
  const parts = name.split(" ").filter(Boolean)
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export default function Sidebar({ approvalsCount = 0, activeView, onViewChange }) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [adminSubMenu, setAdminSubMenu] = useState(null)

  const user = {
    name: "João Silva",
    email: "joao.silva@example.com",
  }

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, id: "dashboard" },
    { name: "Documentos", href: "/documents", icon: FileText, id: "documents" },
    {
      name: "Aprovações",
      href: "/approvals",
      icon: CheckCircle,
      badge: approvalsCount > 0 ? approvalsCount : null,
      id: "approvals",
    },
  ]

  const adminNavigation = [
    { name: "Gerenciar Usuários", href: "/admin/users", icon: Users, id: "users" },
    { name: "Gerenciar Categorias", href: "/admin/categories", icon: Folder, id: "categories" },
    { name: "Gerenciar Departamentos", href: "/admin/departments", icon: Folder, id: "departments" },
    { name: "Tipos de Documento", href: "/admin/document-types", icon: ScrollText, id: "document-types" },
    { name: "Fluxos de Aprovação", href: "/admin/workflows", icon: GitPullRequest, id: "workflows" },
    {
      name: "Relatório de Produtividade",
      href: "/admin/productivity-report",
      icon: BarChart2,
      id: "productivity-report",
    },
    {
      name: "Relatório de Tempo de Aprovação",
      href: "/admin/approval-time-report",
      icon: Clock,
      id: "approval-time-report",
    },
    { name: "Relatório de Auditoria", href: "/admin/audit-report", icon: ClipboardCheck, id: "audit-report" },
  ]

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gray-100 p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Trackdoc</h2>
      </div>
      <nav className="flex-1 space-y-2 py-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onViewChange(item.id)}
                className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
        }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.badge && (
                  <Badge className="ml-auto px-2 py-0.5 text-xs font-semibold bg-red-500 text-white">
                    {item.badge}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
        <div className="pt-4">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Administração</h3>
          {adminNavigation.map((item) => {
            const isActive = activeView === "admin" && adminSubMenu === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onViewChange("admin")
                  setAdminSubMenu(item.id)
                }}
                className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
        }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            )
          })}
        </div>
      </nav>
      <div className="mt-auto space-y-2 border-t border-gray-200 pt-4 dark:border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
          onClick={() => setIsSearchModalOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          Pesquisa Rápida
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
          onClick={() => setIsEmailModalOpen(true)}
        >
          <Mail className="mr-2 h-4 w-4" />
          Convidar por Email
        </Button>
        <QuickSearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
        <EmailInvitationModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${getInitials(user.name)}`} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-50">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  )
}
