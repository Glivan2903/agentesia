"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles } from "lucide-react"
import Dashboard from "@/components/dashboard"
import CompanySelection from "@/components/company-selection"
import Image from "next/image"

export default function Home() {
  const [currentView, setCurrentView] = useState<"register" | "company-selection" | "dashboard">("register")
  const [userData, setUserData] = useState({ nome: "", telefone: "" })
  const [formData, setFormData] = useState({ nome: "", telefone: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ nome: "", telefone: "" })
  const [companyType, setCompanyType] = useState("")

  useEffect(() => {
    // Check if user data exists in localStorage
    const savedUserData = localStorage.getItem("aiAgentUserData")
    const savedCompanyType = localStorage.getItem("aiAgentCompanyType")

    if (savedUserData) {
      const parsed = JSON.parse(savedUserData)
      setUserData(parsed)

      if (savedCompanyType) {
        setCompanyType(savedCompanyType)
        setCurrentView("dashboard")
      } else {
        setCurrentView("company-selection")
      }
    }
  }, [])

  useEffect(() => {
    // Scroll to top when view changes
    window.scrollTo(0, 0)
  }, [currentView])

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Apply Brazilian phone mask
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    } else {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
  }

  const validateForm = () => {
    const newErrors = { nome: "", telefone: "" }
    let isValid = true

    if (formData.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres"
      isValid = false
    }

    const phoneDigits = formData.telefone.replace(/\D/g, "")
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      newErrors.telefone = "Telefone deve ter formato válido"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "telefone") {
      value = formatPhoneNumber(value)
    }
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const sendLeadData = async (userData: { nome: string; telefone: string }) => {
    try {
      await fetch("https://n8nconectajuse.conectajuse.shop/webhook/d21a2c35-dfc7-420d-a339-3d35d678219b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: userData.nome,
          telefone: userData.telefone,
          timestamp: new Date().toISOString(),
          origem: "sistema_teste_agentes",
        }),
      })
    } catch (error) {
      // Silently handle error - don't block user flow
      console.log("Lead tracking error:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = {
      nome: formData.nome.trim(),
      telefone: formData.telefone,
    }

    // Send lead data to webhook
    await sendLeadData(userData)

    localStorage.setItem("aiAgentUserData", JSON.stringify(userData))
    setUserData(userData)
    setCurrentView("company-selection")
    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("aiAgentUserData")
    localStorage.removeItem("aiAgentCompanyType")
    setUserData({ nome: "", telefone: "" })
    setFormData({ nome: "", telefone: "" })
    setCompanyType("")
    setCurrentView("register")
  }

  const isFormValid = formData.nome.trim().length >= 2 && formData.telefone.replace(/\D/g, "").length >= 10

  if (currentView === "company-selection") {
    return (
      <CompanySelection
        userData={userData}
        onCompanySelect={(type) => {
          setCompanyType(type)
          localStorage.setItem("aiAgentCompanyType", type)
          setCurrentView("dashboard")
        }}
      />
    )
  }

  if (currentView === "dashboard") {
    return <Dashboard userData={userData} companyType={companyType} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <Image
            src="/logo-jetsales.png"
            alt="JetSales Brasil"
            width={150}
            height={40}
            className="w-auto h-10 mx-auto mb-4"
          />
          <p className="text-muted-foreground">
            Bem-vindo! Cadastre-se para começar a testar nossos agentes inteligentes.
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl text-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              Cadastro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-foreground">
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  className={`transition-all duration-200 ${
                    errors.nome
                      ? "border-destructive focus:border-destructive focus:ring-destructive"
                      : "focus:border-primary focus:ring-primary"
                  }`}
                  disabled={isLoading}
                />
                {errors.nome && <p className="text-sm text-destructive animate-fade-in">{errors.nome}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium text-foreground">
                  Telefone *
                </Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(79) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange("telefone", e.target.value)}
                  className={`transition-all duration-200 ${
                    errors.telefone
                      ? "border-destructive focus:border-destructive focus:ring-destructive"
                      : "focus:border-primary focus:ring-primary"
                  }`}
                  disabled={isLoading}
                  maxLength={15}
                />
                {errors.telefone && <p className="text-sm text-destructive animate-fade-in">{errors.telefone}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-start to-green-end hover:from-green-start/90 hover:to-green-end/90 text-primary-foreground font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  "Iniciar Teste"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-secondary rounded-lg border border-border animate-fade-in">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Sistema de Demonstração:</span> Teste gratuitamente nossos agentes de IA
            especializados para diferentes tipos de negócios. Veja como a inteligência artificial pode transformar seu
            atendimento.
          </p>
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          Seus dados são seguros e utilizados apenas para personalizar sua experiência.
        </div>
      </div>
    </div>
  )
}
