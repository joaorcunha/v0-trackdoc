"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, TrendingUp, TrendingDown, AlertTriangle, Users, Download, Timer } from "lucide-react"

const mockApprovalData = {
  overview: {
    averageApprovalTime: 3.2,
    fastestApproval: 0.5,
    slowestApproval: 12,
    pendingApprovals: 8,
    overdueApprovals: 2,
  },
  approverStats: [
    {
      id: 1,
      name: "Maria Santos",
      role: "Gerente de Qualidade",
      averageTime: 2.1,
      totalApprovals: 45,
      pendingCount: 3,
      overdueCount: 0,
      efficiency: 95,
      trend: "up",
    },
    {
      id: 2,
      name: "Carlos Oliveira",
      role: "Diretor de Operações",
      averageTime: 3.5,
      totalApprovals: 38,
      pendingCount: 2,
      overdueCount: 1,
      efficiency: 88,
      trend: "stable",
    },
    {
      id: 3,
      name: "Ana Costa",
      role: "Coordenadora de TI",
      averageTime: 2.8,
      totalApprovals: 52,
      pendingCount: 1,
      overdueCount: 0,
      efficiency: 92,
      trend: "up",
    },
    {
      id: 4,
      name: "Roberto Silva",
      role: "Gerente Financeiro",
      averageTime: 4.2,
      totalApprovals: 29,
      pendingCount: 2,
      overdueCount: 1,
      efficiency: 82,
      trend: "down",
    },
    {
      id: 5,
      name: "Fernanda Costa",
      role: "Diretora de RH",
      averageTime: 3.1,
      totalApprovals: 41,
      pendingCount: 0,
      overdueCount: 0,
      efficiency: 90,
      trend: "up",
    },
  ],
  documentTypeStats: [
    {
      type: "Política",
      avgTime: 4.5,
      count: 23,
      slaCompliance: 87,
    },
    {
      type: "Procedimento",
      avgTime: 2.8,
      count: 45,
      slaCompliance: 94,
    },
    {
      type: "Manual",
      avgTime: 3.2,
      count: 18,
      slaCompliance: 91,
    },
    {
      type: "Relatório",
      avgTime: 2.1,
      count: 67,
      slaCompliance: 96,
    },
    {
      type: "Ata",
      avgTime: 1.5,
      count: 34,
      slaCompliance: 98,
    },
  ],
  timeDistribution: [
    {
      range: "0-1 dia",
      count: 45,
      percentage: 24,
    },
    {
      range: "1-3 dias",
      count: 78,
      percentage: 42,
    },
    {
      range: "3-5 dias",
      count: 42,
      percentage: 22,
    },
    {
      range: "5-7 dias",
      count: 15,
      percentage: 8,
    },
    {
      range: "7+ dias",
      count: 7,
      percentage: 4,
    },
  ],
}

const trendIcons = {
  up: <TrendingUp className="h-4 w-4 text-green-600" />,
  down: <TrendingDown className="h-4 w-4 text-red-600" />,
  stable: <Timer className="h-4 w-4 text-gray-600" />,
}

export default function ApprovalTimeReport() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedType, setSelectedType] = useState("all")

  const approvalData = mockApprovalData // Use mock data

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
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Política">Política</SelectItem>
                  <SelectItem value="Procedimento">Procedimento</SelectItem>
                  <SelectItem value="Relatório">Relatório</SelectItem>
                  <SelectItem value="Ata">Ata</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalData.overview.averageApprovalTime} dias</div>
            <p className="text-xs text-green-600">-0.0 dias vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mais Rápida</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalData.overview.fastestApproval} dias</div>
            <p className="text-xs text-muted-foreground">Melhor tempo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mais Lenta</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalData.overview.slowestApproval} dias</div>
            <p className="text-xs text-muted-foreground">Pior tempo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalData.overview.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalData.overview.overdueApprovals}</div>
            <p className="text-xs text-red-600">Acima do SLA</p>
          </CardContent>
        </Card>
      </div>

      {/* Approver Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance dos Aprovadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvalData.approverStats.length === 0 ? (
              <p className="text-center text-gray-500">Nenhum dado de aprovador disponível.</p>
            ) : (
              approvalData.approverStats.map((approver) => (
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
                      <p className="text-sm text-gray-500">{approver.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{approver.averageTime}d</p>
                      <p className="text-xs text-gray-500">Tempo Médio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{approver.totalApprovals}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{approver.pendingCount}</p>
                      <p className="text-xs text-gray-500">Pendentes</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${approver.overdueCount > 0 ? "text-red-600" : ""}`}>
                        {approver.overdueCount}
                      </p>
                      <p className="text-xs text-gray-500">Em Atraso</p>
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
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Type Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tempo por Tipo de Documento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvalData.documentTypeStats.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum dado de tipo de documento disponível.</p>
              ) : (
                approvalData.documentTypeStats.map((docType) => (
                  <div key={docType.type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{docType.type}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{docType.avgTime}d médio</span>
                        <Badge
                          variant={
                            docType.slaCompliance >= 90
                              ? "default"
                              : docType.slaCompliance >= 80
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {docType.slaCompliance}% SLA
                        </Badge>
                      </div>
                    </div>
                    <Progress value={docType.slaCompliance} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{docType.count} documentos</span>
                      <span>Conformidade SLA: {docType.slaCompliance}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvalData.timeDistribution.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum dado de distribuição de tempo disponível.</p>
              ) : (
                approvalData.timeDistribution.map((range) => (
                  <div key={range.range} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{range.range}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{range.count} docs</span>
                        <span className="text-sm font-medium">{range.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={range.percentage} className="h-2" />
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
