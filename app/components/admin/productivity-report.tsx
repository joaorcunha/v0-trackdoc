"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown, FileText, Clock, Users, Download, BarChart3 } from "lucide-react"

const mockProductivityData = {
  overview: {
    totalDocuments: 187,
    documentsThisMonth: 34,
    averageCreationTime: 2.8,
    mostProductiveUser: "João Silva",
    mostProductiveDepartment: "TI",
  },
  userStats: [
    {
      id: 1,
      name: "João Silva",
      department: "TI",
      documentsCreated: 28,
      documentsApproved: 25,
      averageTime: 2.1,
      efficiency: 95,
      trend: "up",
    },
    {
      id: 2,
      name: "Maria Santos",
      department: "Qualidade",
      documentsCreated: 24,
      documentsApproved: 22,
      averageTime: 2.5,
      efficiency: 92,
      trend: "up",
    },
    {
      id: 3,
      name: "Carlos Oliveira",
      department: "Operações",
      documentsCreated: 22,
      documentsApproved: 18,
      averageTime: 3.2,
      efficiency: 85,
      trend: "stable",
    },
    {
      id: 4,
      name: "Ana Costa",
      department: "TI",
      documentsCreated: 19,
      documentsApproved: 17,
      averageTime: 2.8,
      efficiency: 88,
      trend: "up",
    },
    {
      id: 5,
      name: "Pedro Lima",
      department: "Segurança",
      documentsCreated: 16,
      documentsApproved: 14,
      averageTime: 3.5,
      efficiency: 82,
      trend: "down",
    },
    {
      id: 6,
      name: "Lucia Ferreira",
      department: "RH",
      documentsCreated: 15,
      documentsApproved: 13,
      averageTime: 3.1,
      efficiency: 86,
      trend: "stable",
    },
    {
      id: 7,
      name: "Roberto Silva",
      department: "Financeiro",
      documentsCreated: 14,
      documentsApproved: 12,
      averageTime: 3.8,
      efficiency: 80,
      trend: "down",
    },
    {
      id: 8,
      name: "Fernanda Costa",
      department: "Diretoria",
      documentsCreated: 12,
      documentsApproved: 11,
      averageTime: 2.9,
      efficiency: 90,
      trend: "up",
    },
  ],
  departmentStats: [
    {
      name: "TI",
      documents: 47,
      efficiency: 92,
      growth: 15,
    },
    {
      name: "Qualidade",
      documents: 38,
      efficiency: 89,
      growth: 12,
    },
    {
      name: "Operações",
      documents: 35,
      efficiency: 85,
      growth: 8,
    },
    {
      name: "RH",
      documents: 28,
      efficiency: 87,
      growth: 10,
    },
    {
      name: "Financeiro",
      documents: 22,
      efficiency: 82,
      growth: -5,
    },
    {
      name: "Segurança",
      documents: 17,
      efficiency: 84,
      growth: 3,
    },
  ],
  monthlyTrend: [
    {
      month: "Jan",
      documents: 28,
      approvals: 25,
    },
    {
      month: "Fev",
      documents: 32,
      approvals: 29,
    },
    {
      month: "Mar",
      documents: 35,
      approvals: 31,
    },
    {
      month: "Abr",
      documents: 31,
      approvals: 28,
    },
    {
      month: "Mai",
      documents: 29,
      approvals: 26,
    },
    {
      month: "Jun",
      documents: 34,
      approvals: 30,
    },
  ],
}

const trendIcons = {
  up: <TrendingUp className="h-4 w-4 text-green-600" />,
  down: <TrendingDown className="h-4 w-4 text-red-600" />,
  stable: <BarChart3 className="h-4 w-4 text-gray-600" />,
}

export default function ProductivityReport() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const productivityData = mockProductivityData // Usando dados mockados em vez de dados vazios

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-4">
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
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Diretoria">Diretoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivityData.overview.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">+{productivityData.overview.documentsThisMonth} este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Criação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivityData.overview.averageCreationTime} dias</div>
            <p className="text-xs text-green-600">-0.0 dias vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuário Mais Produtivo</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{productivityData.overview.mostProductiveUser}</div>
            <p className="text-xs text-muted-foreground">0 documentos criados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depto. Mais Produtivo</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{productivityData.overview.mostProductiveDepartment}</div>
            <p className="text-xs text-muted-foreground">0 documentos criados</p>
          </CardContent>
        </Card>
      </div>

      {/* User Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productivityData.userStats.length === 0 ? (
              <p className="text-center text-gray-500">Nenhum dado de usuário disponível.</p>
            ) : (
              productivityData.userStats.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{user.documentsCreated}</p>
                      <p className="text-xs text-gray-500">Criados</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{user.documentsApproved}</p>
                      <p className="text-xs text-gray-500">Aprovados</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{user.averageTime}d</p>
                      <p className="text-xs text-gray-500">Tempo Médio</p>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{user.efficiency}%</span>
                        {trendIcons[user.trend]}
                      </div>
                      <Progress value={user.efficiency} className="h-2 mt-1" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productivityData.departmentStats.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum dado de departamento disponível.</p>
              ) : (
                productivityData.departmentStats.map((dept) => (
                  <div key={dept.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{dept.name}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{dept.documents} docs</span>
                        <Badge
                          variant={dept.growth > 0 ? "default" : dept.growth < 0 ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {dept.growth > 0 ? "+" : ""}
                          {dept.growth}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={dept.efficiency} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Eficiência: {dept.efficiency}%</span>
                      <span>Crescimento: {dept.growth}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productivityData.monthlyTrend.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum dado de tendência mensal disponível.</p>
              ) : (
                productivityData.monthlyTrend.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="font-medium w-12">{month.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Documentos: {month.documents}</span>
                        <span>Aprovações: {month.approvals}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Progress value={(month.documents / 35) * 100} className="h-2 flex-1" />
                        <Progress value={(month.approvals / 35) * 100} className="h-2 flex-1" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {month.documents > 0 ? Math.round((month.approvals / month.documents) * 100) : 0}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
