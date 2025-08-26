import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { FileText, Eye, Download, Clock, Users, Building2, Activity } from "lucide-react"

interface DocumentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  document: {
    id: string
    name: string
    type: string
    category: string
    department: string
    views: number
    downloads: number
    shares: number
    lastAccessed: string
    createdAt: string
    size: string
    author: string
  } | null
}

// Mock data for detailed analytics
const accessHistory = [
  { date: "2024-01-01", views: 45, downloads: 12 },
  { date: "2024-01-02", views: 52, downloads: 8 },
  { date: "2024-01-03", views: 38, downloads: 15 },
  { date: "2024-01-04", views: 61, downloads: 18 },
  { date: "2024-01-05", views: 47, downloads: 10 },
  { date: "2024-01-06", views: 55, downloads: 14 },
  { date: "2024-01-07", views: 43, downloads: 9 },
]

const departmentAccess = [
  { department: "RH", views: 156, percentage: 35 },
  { department: "Financeiro", views: 98, percentage: 22 },
  { department: "TI", views: 87, percentage: 20 },
  { department: "Marketing", views: 65, percentage: 15 },
  { department: "Vendas", views: 34, percentage: 8 },
]

const topUsers = [
  { name: "Ana Silva", department: "RH", views: 23, avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Carlos Santos", department: "Financeiro", views: 18, avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Maria Oliveira", department: "TI", views: 15, avatar: "/placeholder.svg?height=32&width=32" },
  { name: "João Costa", department: "Marketing", views: 12, avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Paula Lima", department: "Vendas", views: 9, avatar: "/placeholder.svg?height=32&width=32" },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function DocumentDetailsModal({ isOpen, onClose, document }: DocumentDetailsModalProps) {
  if (!document) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes do Documento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{document.name}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <Badge variant="secondary">{document.type}</Badge>
                    <Badge variant="outline">{document.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {document.department}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{document.views}</div>
                  <div className="text-sm text-gray-500">Visualizações</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{document.downloads}</div>
                  <div className="text-sm text-gray-500">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{document.shares}</div>
                  <div className="text-sm text-gray-500">Compartilhamentos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{document.size}</div>
                  <div className="text-sm text-gray-500">Tamanho</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analytics Tabs */}
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analytics">Análise</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="departments">Departamentos</TabsTrigger>
              <TabsTrigger value="info">Informações</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Access History Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Histórico de Acessos (7 dias)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        views: { label: "Visualizações", color: "hsl(var(--chart-1))" },
                        downloads: { label: "Downloads", color: "hsl(var(--chart-2))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={accessHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} />
                          <Line type="monotone" dataKey="downloads" stroke="var(--color-downloads)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Peak Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Horários de Pico
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>09:00 - 10:00</span>
                        <span>23 acessos</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>14:00 - 15:00</span>
                        <span>18 acessos</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>16:00 - 17:00</span>
                        <span>15 acessos</span>
                      </div>
                      <Progress value={56} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>11:00 - 12:00</span>
                        <span>12 acessos</span>
                      </div>
                      <Progress value={44} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Principais Usuários
                  </CardTitle>
                  <CardDescription>Usuários que mais acessaram este documento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.department}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{user.views} visualizações</div>
                          <div className="text-sm text-gray-500">#{index + 1}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="departments" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Department Access Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Acesso por Departamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        views: { label: "Visualizações", color: "hsl(var(--chart-1))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={departmentAccess}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ department, percentage }) => `${department} (${percentage}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="views"
                          >
                            {departmentAccess.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Department Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes por Departamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentAccess.map((dept, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{dept.department}</span>
                            <span>{dept.views} visualizações</span>
                          </div>
                          <Progress value={dept.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Informações do Documento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nome do Arquivo</label>
                        <p className="mt-1">{document.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tipo</label>
                        <p className="mt-1">{document.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Categoria</label>
                        <p className="mt-1">{document.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Departamento</label>
                        <p className="mt-1">{document.department}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Autor</label>
                        <p className="mt-1">{document.author}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Data de Criação</label>
                        <p className="mt-1">{new Date(document.createdAt).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Último Acesso</label>
                        <p className="mt-1">{new Date(document.lastAccessed).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tamanho do Arquivo</label>
                        <p className="mt-1">{document.size}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
