"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  Stethoscope,
  Scale,
  Scissors,
  UtensilsCrossed,
  Home,
  GraduationCap,
  Car,
  Shirt,
  Dumbbell,
  Palette,
  Wrench,
  ArrowRight,
  Sparkles,
  LogOut,
  User,
  Sun,
} from "lucide-react"
import Image from "next/image"

interface CompanySelectionProps {
  userData: { nome: string; telefone: string }
  onCompanySelect: (type: string) => void
}

const companyTypes = [
  {
    id: "clinica",
    name: "Clínica/Consultório",
    icon: Stethoscope,
    description: "Agendamentos, triagem virtual e atendimento médico",
    color: "from-green-start to-green-end",
    popular: true,
  },
  {
    id: "advocacia",
    name: "Escritório de Advocacia",
    icon: Scale,
    description: "Consultoria jurídica, processos legais e orientações",
    color: "from-green-start to-green-end",
    popular: true,
  },
  {
    id: "barbearia",
    name: "Barbearia/Salão",
    icon: Scissors,
    description: "Agendamentos estéticos e consultoria de beleza",
    color: "from-green-start to-green-end",
    popular: true,
  },
  {
    id: "energia_solar", // Novo segmento
    name: "Energia Solar",
    icon: Sun, // Usando o ícone Sun
    description: "Projetos, orçamentos e suporte para sistemas solares",
    color: "from-green-start to-green-end",
    popular: true,
  },
  {
    id: "restaurante",
    name: "Restaurante/Lanchonete",
    icon: UtensilsCrossed,
    description: "Pedidos online, reservas e cardápio digital",
    color: "from-green-start to-green-end",
    popular: false,
  },
  {
    id: "imobiliaria",
    name: "Imobiliária",
    icon: Home,
    description: "Consultor imobiliário e financiamento de imóveis",
    color: "from-green-start to-green-end",
    popular: false,
  },
  {
    id: "escola",
    name: "Escola/Curso",
    icon: GraduationCap,
    description: "Matrículas, informações acadêmicas e suporte",
    color: "from-green-start to-green-end",
    popular: false,
  },
  {
    id: "automoveis",
    name: "Concessionária/Auto",
    icon: Car,
    description: "Vendas de veículos, financiamento e test-drive",
    color: "from-green-start to-green-end",
    popular: false,
  },
  {
    id: "moda",
    name: "Loja de Roupas",
    icon: Shirt,
    description: "Vendas online, consultoria de moda e estoque",
    color: "from-green-start to-green-end",
    popular: false,
  },
  {
    id: "academia",
    name: "Academia/Fitness",
    icon: Dumbbell,
    description: "Matrículas, planos de treino e acompanhamento",
    color: "from-green-start to-green-end",
    popular: false,
  },
  {
    id: "design",
    name: "Agência/Design",
    icon: Palette,
    description: "Orçamentos criativos, briefings e projetos",
    color: "from-green-start to-green-end",
    popular: false,
  },
  {
    id: "assistencia",
    name: "Assistência Técnica",
    icon: Wrench,
    description: "Suporte técnico, orçamentos e agendamentos",
    color: "from-green-start to-green-end",
    popular: false,
  },
  {
    id: "geral",
    name: "Outros Negócios",
    icon: Building2,
    description: "Atendimento geral para diversos tipos de empresa",
    color: "from-green-start to-green-end",
    popular: false,
  },
]

export default function CompanySelection({ userData, onCompanySelect }: CompanySelectionProps) {
  const [selectedType, setSelectedType] = useState("")

  const handleSelect = (type: string) => {
    setSelectedType(type)
    setTimeout(() => {
      onCompanySelect(type)
    }, 300)
  }

  const handleLogout = () => {
    localStorage.removeItem("aiAgentUserData")
    localStorage.removeItem("aiAgentCompanyType")
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image src="/logo-jetsales.png" alt="JetSales Brasil" width={120} height={32} className="w-auto h-8" />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Olá, {userData.nome.split(" ")[0]}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:bg-secondary hover:border-border hover:text-primary transition-colors bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-start to-green-end rounded-full mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Olá, {userData.nome.split(" ")[0]}! 👋</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Para oferecer a melhor experiência, selecione o tipo de negócio que mais se aproxima do seu:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyTypes.map((company) => {
            const IconComponent = company.icon
            return (
              <Card
                key={company.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-0 shadow-lg relative ${
                  selectedType === company.id ? "ring-2 ring-primary scale-[1.02]" : ""
                }`}
                onClick={() => handleSelect(company.id)}
              >
                {company.popular && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${company.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {company.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {company.description}
                  </CardDescription>
                  <div className="flex items-center text-sm text-primary font-medium group-hover:text-primary/80">
                    <span>Selecionar</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-secondary/60 backdrop-blur-sm rounded-2xl p-6 border border-border max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-2">Por que escolher seu segmento?</h3>
            <p className="text-sm text-muted-foreground">
              Cada tipo de negócio tem necessidades específicas. Ao selecionar seu segmento, você terá acesso a agentes
              especializados e exemplos práticos relevantes para sua área de atuação.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
