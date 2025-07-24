"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  User,
  LogOut,
  Briefcase,
  Sparkles,
  MessageSquare,
  ShoppingCart,
  Target,
  Lightbulb,
  FileText,
  Hospital,
  Gavel,
  Scissors,
  Utensils,
  Home,
  GraduationCap,
  Car,
  Shirt,
  Dumbbell,
  Palette,
  Wrench,
  MoreHorizontal,
  ArrowLeft,
  Sun,
} from "lucide-react"
import Image from "next/image"
import ChatModal from "@/components/chat-modal"

interface DashboardProps {
  userData: {
    nome: string
    telefone: string
  }
  companyType: string
  onLogout: () => void
}

const universalAgents = [
  {
    id: "atendimento_cliente",
    name: "Atendimento ao Cliente",
    icon: MessageSquare,
    description: "Suporte e resolução de dúvidas gerais.",
    type: "universal",
  },
  {
    id: "vendas_negociacao",
    name: "Vendas e Negociação",
    icon: ShoppingCart,
    description: "Auxílio em vendas e propostas comerciais.",
    type: "universal",
  },
  {
    id: "marketing_digital",
    name: "Marketing Digital",
    icon: Target,
    description: "Estratégias e campanhas de marketing.",
    type: "universal",
  },
]

const specializedAgents: {
  [key: string]: { id: string; name: string; icon: React.ElementType; description: string; type: string }[]
} = {
  clinica: [
    {
      id: "agendamento_medico",
      name: "Agendamento Médico",
      icon: Hospital,
      description: "Agendamento de consultas e exames.",
      type: "specialized",
    },
    {
      id: "triagem_virtual",
      name: "Triagem Virtual",
      icon: Lightbulb,
      description: "Avaliação inicial de sintomas e direcionamento.",
      type: "specialized",
    },
  ],
  advocacia: [
    {
      id: "consultoria_juridica",
      name: "Consultoria Jurídica",
      icon: Gavel,
      description: "Orientações sobre questões legais.",
      type: "specialized",
    },
    {
      id: "processos_legais",
      name: "Processos Legais",
      icon: FileText,
      description: "Informações sobre andamento de processos.",
      type: "specialized",
    },
  ],
  barbearia: [
    {
      id: "agendamento_estetico",
      name: "Agendamento Estético",
      icon: Scissors,
      description: "Marcação de horários para serviços de beleza.",
      type: "specialized",
    },
    {
      id: "consultor_beleza",
      name: "Consultor de Beleza",
      icon: Sparkles,
      description: "Dicas e recomendações de estilo e produtos.",
      type: "specialized",
    },
  ],
  energia_solar: [
    // Novo tipo de agente especializado para Energia Solar
    {
      id: "projetos_orcamentos_solar",
      name: "Projetos e Orçamentos",
      icon: Sun,
      description: "Informações sobre projetos e cotações de energia solar.",
      type: "specialized",
    },
    {
      id: "instalacao_manutencao_solar",
      name: "Instalação e Manutenção",
      icon: Wrench,
      description: "Suporte sobre instalação e manutenção de sistemas solares.",
      type: "specialized",
    },
  ],
  restaurante: [
    {
      id: "pedidos_online",
      name: "Pedidos Online",
      icon: Utensils,
      description: "Recebimento de pedidos e informações do cardápio.",
      type: "specialized",
    },
    {
      id: "reservas_mesa",
      name: "Reservas de Mesa",
      icon: Home,
      description: "Gerenciamento de reservas e disponibilidade.",
      type: "specialized",
    },
  ],
  imobiliaria: [
    {
      id: "consultor_imobiliario",
      name: "Consultor Imobiliário",
      icon: Home,
      description: "Informações sobre imóveis e visitas.",
      type: "specialized",
    },
    {
      id: "financiamento_imovel",
      name: "Financiamento Imobiliário",
      icon: Briefcase,
      description: "Orientações sobre opções de crédito e financiamento.",
      type: "specialized",
    },
  ],
  escola: [
    {
      id: "matriculas_cursos",
      name: "Matrículas e Cursos",
      icon: GraduationCap,
      description: "Informações sobre cursos, matrículas e mensalidades.",
      type: "specialized",
    },
    {
      id: "suporte_academico",
      name: "Suporte Acadêmico",
      icon: Lightbulb,
      description: "Dúvidas sobre materiais, horários e professores.",
      type: "specialized",
    },
  ],
  concessionaria: [
    {
      id: "vendas_veiculos",
      name: "Vendas de Veículos",
      icon: Car,
      description: "Informações sobre modelos, preços e promoções.",
      type: "specialized",
    },
    {
      id: "financiamento_automotivo",
      name: "Financiamento Automotivo",
      icon: Briefcase,
      description: "Orientações sobre opções de financiamento de veículos.",
      type: "specialized",
    },
  ],
  moda: [
    {
      id: "consultoria_moda",
      name: "Consultoria de Moda",
      icon: Shirt,
      description: "Dicas de estilo, tendências e combinações de roupas.",
      type: "specialized",
    },
    {
      id: "vendas_roupas",
      name: "Vendas de Roupas",
      icon: ShoppingCart,
      description: "Informações sobre produtos, tamanhos e disponibilidade.",
      type: "specialized",
    },
  ],
  academia: [
    {
      id: "planos_treino",
      name: "Planos de Treino",
      icon: Dumbbell,
      description: "Informações sobre planos, aulas e personal trainers.",
      type: "specialized",
    },
    {
      id: "matriculas_fitness",
      name: "Matrículas Fitness",
      icon: Briefcase,
      description: "Processo de matrícula e informações sobre a academia.",
      type: "specialized",
    },
  ],
  design: [
    {
      id: "projetos_criativos",
      name: "Projetos Criativos",
      icon: Palette,
      description: "Informações sobre serviços de design e portfólio.",
      type: "specialized",
    },
    {
      id: "orcamentos_design",
      name: "Orçamentos de Design",
      icon: FileText,
      description: "Cotações e detalhes para projetos de design.",
      type: "specialized",
    },
  ],
  assistencia: [
    {
      id: "suporte_tecnico",
      name: "Suporte Técnico",
      icon: Wrench,
      description: "Auxílio com problemas técnicos e diagnósticos.",
      type: "specialized",
    },
    {
      id: "agendamento_servicos",
      name: "Agendamento de Serviços",
      icon: Briefcase,
      description: "Marcação de horários para reparos e manutenção.",
      type: "specialized",
    },
  ],
  geral: [
    {
      id: "atendimento_geral",
      name: "Atendimento Geral",
      icon: MoreHorizontal,
      description: "Suporte para dúvidas e necessidades diversas.",
      type: "specialized",
    },
  ],
}

export default function Dashboard({ userData, companyType, onLogout }: DashboardProps) {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<(typeof universalAgents)[0] | null>(null)

  const agentsToDisplay = [...universalAgents, ...(specializedAgents[companyType] || [])]

  const handleAgentClick = (agent: (typeof universalAgents)[0]) => {
    setSelectedAgent(agent)
    setIsChatModalOpen(true)
  }

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false)
    setSelectedAgent(null)
  }

  const handleGoBackToCompanySelection = () => {
    localStorage.removeItem("aiAgentCompanyType")
    window.location.reload() // Simple reload to reset state and go back to company selection
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <Image src="/logo-jetsales.png" alt="JetSales Brasil" width={120} height={32} className="w-auto h-8" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">{userData.nome}</span>
          </div>
          <Button
            variant="ghost"
            onClick={handleGoBackToCompanySelection}
            className="text-primary hover:bg-secondary hidden sm:flex"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Alterar Segmento
          </Button>
          <Button variant="ghost" onClick={onLogout} className="text-muted-foreground hover:bg-secondary">
            <LogOut className="w-5 h-5 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">Escolha um Agente para Testar</h2>
          <p className="text-muted-foreground">
            Selecione um de nossos agentes de IA especializados para iniciar uma demonstração.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agentsToDisplay.map((agent) => {
            const IconComponent = agent.icon
            return (
              <Card
                key={agent.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-card/90 backdrop-blur-sm border-0"
                onClick={() => handleAgentClick(agent)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="relative mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-start to-green-end text-primary-foreground rounded-full">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    {agent.type === "universal" && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        Universal
                      </span>
                    )}
                    {agent.type === "specialized" && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        Especializado
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground mb-2">{agent.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>

      {selectedAgent && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={handleCloseChatModal}
          agent={selectedAgent}
          userData={userData}
          companyType={companyType}
        />
      )}
    </div>
  )
}
