"use client"

import { useState, useEffect } from "react"
import { Search, Users } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Ministry {
  id: number
  nome: string
  descricao?: string
  cor?: string
  membros?: { id: number; nome: string }[]
}

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [filteredMinistries, setFilteredMinistries] = useState<Ministry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMinistries()
  }, [])

  useEffect(() => {
    filterMinistries()
  }, [ministries, searchTerm])

  const loadMinistries = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ministerios?incluirMembros=true")
      const data = await response.json()
      setMinistries(data)
    } catch (error) {
      console.error("Erro ao carregar ministérios:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterMinistries = () => {
    let filtered = ministries.filter((m) => m.nome.toLowerCase() !== "sem ministério")

    if (searchTerm) {
      filtered = filtered.filter((ministry) => ministry.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredMinistries(filtered)
  }

  const getInitials = (name: string) => {
    const names = name.split(" ")
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
        <div className="md:ml-64 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
        </div>
    )
  }

  return (
      <div className="md:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-gray-600 border-b border-gray-500/50 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">MINISTÉRIOS</h1>
              <p className="text-gray-200 font-medium">Organize e gerencie os ministérios da juventude</p>
            </div>
          </div>
        </header>

        {/* Search */}
        <section className="p-6 md:p-8 border-b border-gray-700/50">
          <div className="max-w-6xl mx-auto">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                  type="text"
                  placeholder="Buscar ministérios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full"
              />
            </div>
          </div>
        </section>

        {/* Ministries Grid */}
        <section className="p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {filteredMinistries.length} {filteredMinistries.length === 1 ? "ministério" : "ministérios"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMinistries.map((ministry) => (
                  <div key={ministry.id} className="card flex flex-col">
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{ministry.nome}</h3>
                          {ministry.descricao && <p className="text-gray-400 text-sm mb-4">{ministry.descricao}</p>}
                        </div>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium text-gray-300">
                          <div className="flex items-center space-x-2">
                            <Users size={16} />
                            <span>
                          {ministry.membros?.length || 0} {ministry.membros?.length === 1 ? "membro" : "membros"}
                        </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 text-sm">
                          {ministry.membros && ministry.membros.length > 0 ? (
                              <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                {ministry.membros.map((member) => (
                                    <li key={member.id} className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8 text-xs">
                                        <AvatarFallback className="bg-blue-primary/30 text-blue-primary font-bold">
                                          {getInitials(member.nome)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-light-gray">{member.nome}</span>
                                    </li>
                                ))}
                              </ul>
                          ) : (
                              <p className="text-gray-500">Nenhum membro neste ministério.</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
              ))}
            </div>

            {filteredMinistries.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="text-gray-500" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhum ministério encontrado</h3>
                  <p className="text-gray-500">
                    {searchTerm ? "Tente ajustar sua busca" : "Não há ministérios para exibir."}
                  </p>
                </div>
            )}
          </div>
        </section>
      </div>
  )
}