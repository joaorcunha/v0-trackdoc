"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClipboardCheck, User, FileText } from "lucide-react"

export default function AuditReport() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Relatório de Auditoria</h2>

      <Card>
        <CardHeader>
          <CardTitle>Log de Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ação</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead>Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    <ClipboardCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum dado de auditoria disponível.</p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades por Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-gray-500">
              <User className="h-12 w-12 opacity-50" />
              <p className="ml-4">Gráfico de atividades por usuário será exibido aqui.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atividades por Documento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-gray-500">
              <FileText className="h-12 w-12 opacity-50" />
              <p className="ml-4">Gráfico de atividades por documento será exibido aqui.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
