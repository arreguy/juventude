"use client"

import { useState, useEffect } from "react"
import { Plus, Calendar, Users, Trash2, Eye, Edit, Info } from "lucide-react"
import { EventForm } from "@/components/event-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Event {
  id: number
  data: string
  categoria: "Culto" | "EBD"
  contagemTotal: number
  contagemVisitantes?: number
  observacao?: string
  // Culto specific
  operacional?: number
  recepcao?: number
  producao?: number
  louvor?: number
  midia?: number
  fotografia?: number
  intercessao?: number
  // EBD specific
  contagemHomens?: number
  contagemMulheres?: number
}

const eventTypes = [
  { id: "culto", name: "Culto", icon: Users, color: "bg-pink-vibrant" },
  { id: "ebd", name: "EBD", icon: Calendar, color: "bg-pink-vibrant" },
]

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("list")
  const [eventType, setEventType] = useState("culto")
  const [events, setEvents] = useState<Event[]>([])
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/eventos")
      const data = await response.json()
      // Sort events by date descending
      data.sort((a: Event, b: Event) => new Date(b.data).getTime() - new Date(a.data).getTime())
      setEvents(data)
    } catch (error) {
      console.error("Erro ao carregar eventos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setEventType(event.categoria.toLowerCase())
    setActiveTab("form")
  }

  const handleDeleteEvent = async (event: Event) => {
    if (confirm(`Tem certeza que deseja excluir este ${event.categoria.toLowerCase()}?`)) {
      try {
        await fetch(`/api/eventos/${event.id}`, { method: "DELETE" })
        loadEvents()
      } catch (error) {
        console.error("Erro ao excluir evento:", error)
      }
    }
  }

  const handleSuccess = () => {
    loadEvents()
    setActiveTab("list")
    setEditingEvent(null)
  }

  const handleSwitchToForm = () => {
    setEditingEvent(null)
    setActiveTab("form")
  }

  const formatDate = (dateString: string) => {
    // Adding T00:00:00 to ensure the date is parsed in local timezone, not UTC
    return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR")
  }

  if (loading) {
    return (
        <div className="md:ml-64 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-vibrant"></div>
        </div>
    )
  }

  const renderVolunteerDetails = (event: Event) => {
    const volunteerFields = [
      { key: "operacional", label: "Operacional" },
      { key: "recepcao", label: "Recepção" },
      { key: "producao", label: "Produção" },
      { key: "louvor", label: "Louvor" },
      { key: "midia", label: "Criativo (Mídia)" },
      { key: "fotografia", label: "Fotografia" },
      { key: "intercessao", label: "Intercessão" },
    ]

    return (
        <div className="space-y-3">
          {volunteerFields.map((field) => {
            const count = event[field.key as keyof Event] as number | undefined
            if (count !== undefined && count > 0) {
              return (
                  <div key={field.key} className="flex justify-between items-center text-light-gray">
                    <span>{field.label}:</span>
                    <span className="font-bold text-white">{count}</span>
                  </div>
              )
            }
            return null
          })}
        </div>
    )
  }

  const renderEBDDetails = (event: Event) => {
    return (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-light-gray">
            <span>Homens:</span>
            <span className="font-bold text-white">{event.contagemHomens || 0}</span>
          </div>
          <div className="flex justify-between items-center text-light-gray">
            <span>Mulheres:</span>
            <span className="font-bold text-white">{event.contagemMulheres || 0}</span>
          </div>
        </div>
    )
  }

  return (
      <div className="md:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-pink-vibrant border-b border-pink-600/50 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-white mb-2">EVENTOS</h1>
                <p className="text-pink-100 font-medium">Gerencie cultos, EBD e eventos especiais</p>
              </div>
              <button
                  onClick={handleSwitchToForm}
                  className="bg-white text-pink-vibrant hover:bg-pink-50 font-bold px-6 py-3 rounded-xl transition-colors flex items-center space-x-2 self-start md:self-auto"
              >
                <Plus size={20} />
                <span>Novo Evento</span>
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <section className="p-6 md:p-8 border-b border-gray-700/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex space-x-1 bg-gray-800/50 rounded-2xl p-1">
              <button
                  onClick={() => setActiveTab("list")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 font-medium ${
                      activeTab === "list"
                          ? "bg-pink-vibrant text-white"
                          : "text-gray-400 hover:text-light-gray hover:bg-gray-700/50"
                  }`}
              >
                <Eye size={20} />
                <span>Ver Eventos</span>
              </button>
              <button
                  onClick={handleSwitchToForm}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 font-medium ${
                      activeTab === "form"
                          ? "bg-pink-vibrant text-white"
                          : "text-gray-400 hover:text-light-gray hover:bg-gray-700/50"
                  }`}
              >
                <Plus size={20} />
                <span>{editingEvent ? "Editar Evento" : "Adicionar Evento"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "list" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                      {events.length} {events.length === 1 ? "evento" : "eventos"}
                    </h2>
                  </div>

                  {/* Events List */}
                  <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event.id} className="card">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Left Side: Info */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-4">
                                <div
                                    className={`w-4 h-4 rounded-full ${
                                        event.categoria === "Culto" ? "bg-pink-vibrant" : "bg-blue-primary"
                                    }`}
                                ></div>
                                <h3 className="text-2xl font-black text-white">{event.categoria}</h3>
                                <span className="text-xl font-bold text-gray-300">{formatDate(event.data)}</span>
                              </div>

                              <div className="flex items-center space-x-6 mb-3">
                                <div className="flex items-center space-x-2">
                                  <Users size={24} className="text-pink-vibrant" />
                                  <div>
                                    <span className="text-gray-400 text-sm">Total:</span>
                                    <span className="text-white font-black text-3xl ml-2">{event.contagemTotal}</span>
                                  </div>
                                </div>

                                {event.contagemVisitantes !== undefined && event.contagemVisitantes > 0 && (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-gray-400 text-xs">Visitantes:</span>
                                      <span className="text-white font-bold text-sm ml-1">{event.contagemVisitantes}</span>
                                    </div>
                                )}
                              </div>

                              {event.observacao && <p className="text-gray-400 text-sm mt-3 italic">"{event.observacao}"</p>}
                            </div>

                            {/* Right Side: Actions */}
                            <div className="flex space-x-2 self-start md:self-center">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button className="bg-blue-primary/20 hover:bg-blue-primary/30 text-blue-primary px-4 py-2 rounded-lg transition-colors">
                                    <Info size={16} />
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-900 border-gray-700">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">
                                      Detalhes do {event.categoria} - {formatDate(event.data)}
                                    </DialogTitle>
                                  </DialogHeader>
                                  {event.categoria === "Culto" ? renderVolunteerDetails(event) : renderEBDDetails(event)}
                                </DialogContent>
                              </Dialog>

                              <button
                                  onClick={() => handleEditEvent(event)}
                                  className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 px-4 py-2 rounded-lg transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                  onClick={() => handleDeleteEvent(event)}
                                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>

                  {events.length === 0 && !loading && (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Calendar className="text-gray-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhum evento encontrado</h3>
                        <p className="text-gray-500">Comece adicionando um novo evento</p>
                      </div>
                  )}
                </div>
            ) : (
                <div>
                  {/* Event Type Selection */}
                  <div className="mb-6">
                    <div className="flex space-x-1 bg-gray-800/50 rounded-2xl p-1 max-w-md">
                      {eventTypes.map((type) => {
                        const Icon = type.icon
                        return (
                            <button
                                key={type.id}
                                onClick={() => setEventType(type.id)}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 font-medium ${
                                    eventType === type.id
                                        ? "bg-pink-vibrant text-white"
                                        : "text-gray-400 hover:text-light-gray hover:bg-gray-700/50"
                                }`}
                                disabled={!!editingEvent} // Disable switching type when editing
                            >
                              <Icon size={20} />
                              <span>{type.name}</span>
                            </button>
                        )
                      })}
                    </div>
                    {!!editingEvent && (
                        <p className="text-xs text-yellow-muted mt-2">
                          Não é possível alterar o tipo de um evento existente.
                        </p>
                    )}
                  </div>

                  <EventForm
                      eventType={eventType}
                      onSuccess={handleSuccess}
                      initialData={editingEvent}
                      onCancel={() => {
                        setEditingEvent(null)
                        setActiveTab("list")
                      }}
                  />
                </div>
            )}
          </div>
        </section>
      </div>
  )
}
