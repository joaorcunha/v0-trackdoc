"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, BookOpen, MessageCircle, Phone, Mail, Video, Clock, Send, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketMessage, setTicketMessage] = useState("")

  const categories = [
    { id: "all", label: "Todos", count: 45 },
    { id: "getting-started", label: "Primeiros Passos", count: 12 },
    { id: "documents", label: "Documentos", count: 15 },
    { id: "approvals", label: "Aprovações", count: 8 },
    { id: "admin", label: "Administração", count: 6 },
    { id: "ai", label: "IA e Automação", count: 4 },
  ]

  const faqItems = [
    {
      category: "getting-started",
      question: "Como faço para começar a usar o TrackDoc?",
      answer:
        "Para começar, faça login com suas credenciais e acesse o Dashboard. Lá você encontrará um tour guiado que o ajudará a conhecer as principais funcionalidades da plataforma.",
    },
    {
      category: "documents",
      question: "Como posso fazer upload de documentos?",
      answer:
        "Vá para a seção 'Documentos' e clique no botão 'Novo Documento'. Você pode fazer upload de arquivos PDF, DOC, DOCX e outros formatos suportados. O sistema automaticamente extrairá metadados e aplicará tags relevantes.",
    },
    {
      category: "approvals",
      question: "Como funciona o processo de aprovação?",
      answer:
        "Documentos podem ser enviados para aprovação através do workflow configurado. Os aprovadores receberão notificações e poderão revisar, aprovar ou rejeitar documentos diretamente na plataforma.",
    },
    {
      category: "ai",
      question: "Como usar a IA para criar documentos?",
      answer:
        "Acesse a seção 'Criar com IA' no menu lateral. Escolha o tipo de documento, defina os parâmetros desejados e a IA gerará um documento profissional baseado nas suas especificações.",
    },
    {
      category: "admin",
      question: "Como gerenciar usuários e permissões?",
      answer:
        "Na seção 'Administração', você pode adicionar novos usuários, definir roles e permissões, gerenciar departamentos e configurar workflows de aprovação.",
    },
    {
      category: "documents",
      question: "Posso colaborar em documentos com outros usuários?",
      answer:
        "Sim! Você pode compartilhar documentos com outros usuários, definir permissões de visualização ou edição, e acompanhar todas as alterações através do histórico de versões.",
    },
  ]

  const tutorials = [
    {
      title: "Introdução ao TrackDoc",
      description: "Aprenda os conceitos básicos da plataforma",
      duration: "5 min",
      type: "video",
      difficulty: "Iniciante",
    },
    {
      title: "Gerenciamento de Documentos",
      description: "Como organizar e categorizar seus documentos",
      duration: "8 min",
      type: "video",
      difficulty: "Iniciante",
    },
    {
      title: "Configurando Workflows de Aprovação",
      description: "Guia completo para configurar processos de aprovação",
      duration: "12 min",
      type: "video",
      difficulty: "Intermediário",
    },
    {
      title: "Usando IA para Criação de Documentos",
      description: "Maximize sua produtividade com ferramentas de IA",
      duration: "10 min",
      type: "video",
      difficulty: "Intermediário",
    },
  ]

  const supportTickets = [
    {
      id: "#TK-001",
      subject: "Problema com upload de arquivo",
      status: "Em andamento",
      priority: "Alta",
      created: "2024-01-15",
      agent: "Maria Santos",
    },
    {
      id: "#TK-002",
      subject: "Dúvida sobre permissões",
      status: "Resolvido",
      priority: "Média",
      created: "2024-01-14",
      agent: "João Costa",
    },
  ]

  const filteredFAQ = faqItems.filter(
    (item) =>
      (selectedCategory === "all" || item.category === selectedCategory) &&
      (searchQuery === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Central de Ajuda</h1>
          <p className="text-gray-600">Encontre respostas, tutoriais e suporte técnico</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar na central de ajuda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Documentação</h3>
                <p className="text-sm text-gray-600">Guias detalhados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Chat ao Vivo</h3>
                <p className="text-sm text-gray-600">Suporte imediato</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Tutoriais</h3>
                <p className="text-sm text-gray-600">Aprenda assistindo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
          <TabsTrigger value="support">Suporte</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="h-8"
              >
                {category.label}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>Encontre respostas para as dúvidas mais comuns</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQ.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tutoriais em Vídeo</CardTitle>
              <CardDescription>Aprenda a usar o TrackDoc com nossos tutoriais passo a passo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutorials.map((tutorial, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                          <Video className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">{tutorial.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{tutorial.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{tutorial.duration}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {tutorial.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Ticket */}
            <Card>
              <CardHeader>
                <CardTitle>Abrir Chamado</CardTitle>
                <CardDescription>Descreva seu problema e nossa equipe entrará em contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Assunto</label>
                  <Input
                    placeholder="Descreva brevemente o problema"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={4}
                    placeholder="Descreva detalhadamente o problema ou dúvida"
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                  />
                </div>
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Chamado
                </Button>
              </CardContent>
            </Card>

            {/* My Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Meus Chamados</CardTitle>
                <CardDescription>Acompanhe o status dos seus chamados de suporte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{ticket.id}</span>
                        <Badge
                          variant={ticket.status === "Resolvido" ? "default" : "secondary"}
                          className={cn(
                            ticket.status === "Resolvido" && "bg-green-100 text-green-700",
                            ticket.status === "Em andamento" && "bg-yellow-100 text-yellow-700",
                          )}
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.subject}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Agente: {ticket.agent}</span>
                        <span>{ticket.created}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Telefone</h3>
                <p className="text-gray-600 text-sm mb-3">Suporte por telefone das 8h às 18h</p>
                <p className="font-medium">+55 (11) 9999-9999</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600 text-sm mb-3">Resposta em até 24 horas</p>
                <p className="font-medium">suporte@trackdoc.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Chat ao Vivo</h3>
                <p className="text-gray-600 text-sm mb-3">Suporte imediato online</p>
                <Button size="sm" className="w-full">
                  Iniciar Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Horário de Atendimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Suporte Técnico</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Segunda a Sexta: 8h às 18h</p>
                    <p>Sábado: 9h às 13h</p>
                    <p>Domingo: Fechado</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Emergências</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>24 horas por dia</p>
                    <p>7 dias por semana</p>
                    <p>Para clientes Premium</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
