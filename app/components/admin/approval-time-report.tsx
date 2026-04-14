"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingUp, TrendingDown, BarChart2 } from "lucide-react"

export default function ApprovalTimeReport() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Relatório de Tempo de Aprovação</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio Geral</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h 0m</div>
            <p className="text-xs text-muted-foreground">Média de todos os fluxos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Tempo</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h 0m</div>
            <p className="text-xs text-muted-foreground">Fluxo mais rápido</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pior Tempo</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h 0m</div>
            <p className="text-xs text-muted-foreground">Fluxo mais lento</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tempo de Aprovação por Fluxo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <BarChart2 className="h-12 w-12 opacity-50" />
            <p className="ml-4">Gráfico de tempo de aprovação por fluxo será exibido aqui.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Tempo de Aprovação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <Clock className="h-12 w-12 opacity-50" />
            <p className="ml-4">Gráfico de histórico de tempo de aprovação será exibido aqui.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
