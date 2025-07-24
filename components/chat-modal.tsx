"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Trash2, X, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image" // Import Image component

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  agent: {
    id: string
    name: string
    icon: React.ElementType
    description: string
    type: string
  }
  userData: {
    nome: string
    telefone: string
  }
  companyType: string
}

interface Message {
  id: number
  text: string
  sender: "user" | "agent"
  timestamp: string
}

// Helper function to parse JSON messages and extract the 'output'
const getDisplayedMessage = (messageText: string): string => {
  try {
    const parsed = JSON.parse(messageText)
    if (typeof parsed === "object" && parsed !== null && "output" in parsed && typeof parsed.output === "string") {
      return parsed.output
    }
  } catch (e) {
    // Not a JSON string, or not in the expected format, return original text
  }
  return messageText
}

export default function ChatModal({ isOpen, onClose, agent, userData, companyType }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isSending, setIsSending] = useState(false) // New state for loading indicator
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Set initial greeting message
      const greetingMessage: Message = {
        id: Date.now(),
        text: "Envie uma mensagem para iniciar a demonstração.",
        sender: "agent",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([greetingMessage])
    }
  }, [isOpen, agent, userData, companyType])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isSending) return

    const userMessageText = inputMessage.trim()
    const newUserMessage: Message = {
      id: Date.now(),
      text: userMessageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setInputMessage("")
    setIsSending(true) // Set sending state to true

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: userData.nome,
          telefone: userData.telefone,
          tipo_empresa: companyType,
          agente_selecionado: agent.name,
          mensagem: userMessageText,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json() // Assuming the webhook returns JSON
      const agentResponseText = data.output || "Desculpe, não consegui processar sua solicitação no momento." // Extract 'output' or provide a fallback

      const agentResponse: Message = {
        id: Date.now() + 1,
        text: agentResponseText,
        sender: "agent",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prevMessages) => [...prevMessages, agentResponse])
    } catch (error) {
      console.error("Erro ao enviar mensagem para o webhook:", error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Ocorreu um erro ao tentar se comunicar com o agente. Por favor, tente novamente.",
        sender: "agent",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsSending(false) // Reset sending state
    }
  }

  const handleClearChat = () => {
    setMessages([])
    // Re-send greeting after clearing
    setTimeout(() => {
      const greetingMessage: Message = {
        id: Date.now(),
        text: "Envie uma mensagem para iniciar a demonstração.",
        sender: "agent",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([greetingMessage])
    }, 300)
  }

  const AgentIconComponent = agent.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col h-[90vh] max-h-[700px] w-[95vw] max-w-[600px] p-0 bg-card/90 backdrop-blur-sm">
        <DialogHeader className="bg-gradient-to-r from-green-start to-green-end p-4 flex flex-row items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center">
              <AgentIconComponent className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-primary-foreground text-lg font-semibold">{agent.name}</DialogTitle>
              <span className="text-primary-foreground text-xs opacity-80">Online agora</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearChat}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Limpar Conversa</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "agent" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Image
                      src="/logo-jetsales.png"
                      alt="JetSales Brasil Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm">{getDisplayedMessage(msg.text)}</p>
                <span
                  className={`block text-xs mt-1 ${msg.sender === "user" ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {msg.timestamp}
                </span>
              </div>
              {msg.sender === "user" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border flex items-center space-x-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
            className="flex-1 focus:border-primary focus:ring-primary"
            disabled={isSending} // Disable input while sending
          />
          <Button
            onClick={handleSendMessage}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSending || inputMessage.trim() === ""} // Disable button while sending or if input is empty
          >
            {isSending ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Enviar</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
