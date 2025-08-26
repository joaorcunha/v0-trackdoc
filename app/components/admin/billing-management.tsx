"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CreditCard,
  Calendar,
  DollarSign,
  Download,
  Edit,
  CheckCircle,
  AlertCircle,
  Building,
  Users,
  FileText,
  Clock,
  Trash2,
  Plus,
} from "lucide-react"

// Mock data para demonstração
const currentPlan = {
  name: "Plano Empresarial",
  price: 299.99,
  currency: "BRL",
  billing: "monthly",
  users: 50,
  storage: "500GB",
  features: [
    "Até 50 usuários",
    "500GB de armazenamento",
    "Fluxos de aprovação ilimitados",
    "Relatórios avançados",
    "Suporte prioritário",
    "API completa",
  ],
  nextBilling: "2024-02-15",
}

const invoices = [
  {
    id: "INV-2024-001",
    date: "2024-01-15",
    amount: 299.99,
    status: "paid",
    description: "Plano Empresarial - Janeiro 2024",
    downloadUrl: "#",
  },
  {
    id: "INV-2023-012",
    date: "2023-12-15",
    amount: 299.99,
    status: "paid",
    description: "Plano Empresarial - Dezembro 2023",
    downloadUrl: "#",
  },
  {
    id: "INV-2023-011",
    date: "2023-11-15",
    amount: 299.99,
    status: "paid",
    description: "Plano Empresarial - Novembro 2023",
    downloadUrl: "#",
  },
]

const paymentMethods = [
  {
    id: "pm_1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "card",
    brand: "mastercard",
    last4: "8888",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
  },
]

const availablePlans = [
  {
    id: "basic",
    name: "Plano Básico",
    price: 99.99,
    users: 10,
    storage: "100GB",
    features: ["Até 10 usuários", "100GB de armazenamento", "Fluxos básicos"],
  },
  {
    id: "professional",
    name: "Plano Profissional",
    price: 199.99,
    users: 25,
    storage: "250GB",
    features: ["Até 25 usuários", "250GB de armazenamento", "Fluxos avançados", "Relatórios básicos"],
  },
  {
    id: "enterprise",
    name: "Plano Empresarial",
    price: 299.99,
    users: 50,
    storage: "500GB",
    features: [
      "Até 50 usuários",
      "500GB de armazenamento",
      "Fluxos ilimitados",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
  },
]

export default function BillingManagement() {
  const [showPlanChangeDialog, setShowPlanChangeDialog] = useState(false)
  const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Pago
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Falhou
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCardBrandIcon = (brand: string) => {
    // Em um projeto real, você usaria ícones específicos das bandeiras
    return <CreditCard className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Plano Atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Plano Atual
          </CardTitle>
          <CardDescription>Gerencie seu plano de assinatura e recursos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{currentPlan.name}</h3>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {currentPlan.price.toFixed(2)}
                  <span className="text-sm font-normal text-gray-500">/mês</span>
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{currentPlan.users} usuários</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{currentPlan.storage} de armazenamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Próxima cobrança: {new Date(currentPlan.nextBilling).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog open={showPlanChangeDialog} onOpenChange={setShowPlanChangeDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Alterar Plano
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Alterar Plano de Assinatura</DialogTitle>
                      <DialogDescription>Escolha o plano que melhor atende às suas necessidades</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {availablePlans.map((plan) => (
                        <Card
                          key={plan.id}
                          className={`cursor-pointer transition-colors ${selectedPlan === plan.id ? "ring-2 ring-blue-500" : ""}`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <div className="text-2xl font-bold text-blue-600">
                              R$ {plan.price.toFixed(2)}
                              <span className="text-sm font-normal text-gray-500">/mês</span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="text-xs">{feature}</span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <Button variant="outline" onClick={() => setShowPlanChangeDialog(false)}>
                        Cancelar
                      </Button>
                      <Button disabled={!selectedPlan}>Confirmar Alteração</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">Cancelar Assinatura</Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Recursos Inclusos</h4>
              <div className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métodos de Pagamento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Métodos de Pagamento
              </CardTitle>
              <CardDescription>Gerencie seus cartões e formas de pagamento</CardDescription>
            </div>
            <Dialog open={showPaymentMethodDialog} onOpenChange={setShowPaymentMethodDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Cartão
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
                  <DialogDescription>Adicione um novo cartão de crédito ou débito</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Data de Expiração</Label>
                      <Input id="expiryDate" placeholder="MM/AA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input id="cardName" placeholder="João Silva" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setShowPaymentMethodDialog(false)}>
                    Cancelar
                  </Button>
                  <Button>Adicionar Cartão</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getCardBrandIcon(method.brand)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">**** **** **** {method.last4}</span>
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Padrão
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Expira em {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button variant="outline" size="sm">
                      Definir como Padrão
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Faturas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Histórico de Faturas
          </CardTitle>
          <CardDescription>Visualize e baixe suas faturas anteriores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium">{invoice.id}</div>
                    <p className="text-sm text-gray-500">{invoice.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">R$ {invoice.amount.toFixed(2)}</div>
                    <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(invoice.status)}
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Baixar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uso Atual */}
      <Card>
        <CardHeader>
          <CardTitle>Uso Atual</CardTitle>
          <CardDescription>Monitore o uso dos recursos do seu plano</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Usuários</span>
                <span className="text-sm text-gray-500">32 / 50</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "64%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Armazenamento</span>
                <span className="text-sm text-gray-500">320GB / 500GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "64%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Documentos</span>
                <span className="text-sm text-gray-500">1,247</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
