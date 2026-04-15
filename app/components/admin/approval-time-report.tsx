"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, TrendingUp, TrendingDown, AlertTriangle, Users, Download, Timer } from "lucide-react"
import { getUsers, getDocumentTypes, getDashboardStats } from "@/app/admin/actions"

const trendIcons: Record<string, React.ReactNode> = {
  up: <TrendingUp className="h-4 w-4 text-green-600" />,
  down: <TrendingDown className="h-4 w-4 text-red-600" />,
  stable: <Clock className="h-4 w-4 text-muted-foreground" />,
}

export default function ApprovalTimeReport() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [documentTypes, setDocumentTypes] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [usersData, typesData] = await Promise.all([
        getUsers(),
        getDocumentTypes(),
      ])
      setUsers(usersData)
      setDocumentTypes(typesData)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const approvalData = {
    overview: {
      averageApprovalTime: 0,
      fastestApproval: 0,
      slowestApproval: 0,
      pendingApprovals: 0,
      overdueApprovals: 0,
    },
    approverStats: users.filter(u => u.role === "admin" || u.role === "manager").map(u => ({
      id: u.id,
      name: u.full_name,
      role: u.role === "admin" ? "Administrador" : "Gerente",
      averageTime: 0,
      totalApprovals: 0,
      pendingCount: 0,
      overdueCount: 0,
      efficiency: 0,
      trend: "stable" as const,
    })),
    documentTypeStats: documentTypes.map(dt => ({
      type: dt.name,
      avgTime: 0,
      count: 0,
      slaCompliance: 100,
    })),
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Este Trimestre</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalData.overview.averageApprovalTime} dias</div>
            <p className="text-xs text-muted-foreground">Para aprovação completa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mais Rápido</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalData.overview.fastestApproval} dias</div>
            <p className="text-xs text-muted-foreground">Menor tempo de aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mais Lento</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalData.overview.slowestApproval} dias</div>
            <p className="text-xs text-muted-foreground">Maior tempo de aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Timer className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalData.overview.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalData.overview.overdueApprovals}</div>
            <p className="text-xs text-muted-foreground">Fora do prazo</p>
          </CardContent>
        </Card>
      </div>

      {/* Approver Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Aprovador</CardTitle>
        </CardHeader>
        <CardContent>
          {approvalData.approverStats.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum aprovador cadastrado.</p>
          ) : (
            <div className="space-y-4">
              {approvalData.approverStats.map((approver) => (
                <div key={approver.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {approver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{approver.name}</h3>
                      <p className="text-sm text-muted-foreground">{approver.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{approver.averageTime}d</p>
                      <p className="text-xs text-muted-foreground">Tempo Médio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{approver.totalApprovals}</p>
                      <p className="text-xs text-muted-foreground">Aprovações</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{approver.pendingCount}</p>
                      <p className="text-xs text-muted-foreground">Pendentes</p>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{approver.efficiency}%</span>
                        {trendIcons[approver.trend]}
                      </div>
                      <Progress value={approver.efficiency} className="h-2 mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Type Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Tempo por Tipo de Documento</CardTitle>
        </CardHeader>
        <CardContent>
          {approvalData.documentTypeStats.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum tipo de documento cadastrado.</p>
          ) : (
            <div className="space-y-4">
              {approvalData.documentTypeStats.map((type) => (
                <div key={type.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{type.type}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">{type.avgTime} dias</span>
                      <Badge variant={type.slaCompliance >= 90 ? "default" : "destructive"}>
                        {type.slaCompliance}% SLA
                      </Badge>
                    </div>
                  </div>
                  <Progress value={type.slaCompliance} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
