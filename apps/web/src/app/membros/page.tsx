"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, Trash2, Users, Phone, Calendar, ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { MemberModal } from "@/components/member-modal"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// --- INTERFACES E TIPOS ---
interface Member {
  id: number
  nome: string
  idade?: number
  telefone?: string
  ativo: boolean
  ministerios?: { id: number; nome: string }[]
  dataNascimento?: string
}

interface Ministry {
  id: number
  nome: string
}

type SortKey = "nome" | "idade" | "ministerios" | "status" | "dataNascimento"
type SortOrder = "asc" | "desc"

// --- FUNÇÕES AUXILIARES ---

const formatMinistryName = (name: string): string => {
  if (!name) return "";
  const lowerCaseName = name.toLowerCase();
  const specificNames: { [key: string]: string } = {
    "producao": "Produção", "teatro": "Teatro", "salvavidas": "Salva-Vidas", "intercessao": "Intercessão", "recepcao": "Recepção",
  };
  return specificNames[lowerCaseName] || name.charAt(0).toUpperCase() + lowerCaseName.slice(1);
}

const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return "-";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  if (cleaned.length === 10) return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  return phone;
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    // Adiciona 1 dia para corrigir o problema de fuso horário que pode exibir o dia anterior
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toLocaleDateString('pt-BR');
  } catch { return dateString; }
}

// --- COMPONENTE PRINCIPAL ---
export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [ministryFilter, setMinistryFilter] = useState<string>("all")

  const [sortKey, setSortKey] = useState<SortKey>("nome")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])
  useEffect(() => { applyFiltersAndSorting() }, [members, searchTerm, showActiveOnly, ministryFilter, sortKey, sortOrder])

  const loadData = async () => {
    setLoading(true);
    try {
      const [membersResponse, ministriesResponse] = await Promise.all([ fetch(`/api/membros`), fetch("/api/ministerios") ]);
      const membersData = await membersResponse.json();
      const ministriesData = await ministriesResponse.json();
      setMembers(Array.isArray(membersData) ? membersData : []);
      setMinistries(Array.isArray(ministriesData) ? ministriesData : []);
    } catch (error) { console.error("Erro ao carregar dados:", error); }
    finally { setLoading(false); }
  }

  const applyFiltersAndSorting = () => {
    let processedMembers = [...members]

    // Filtragem
    if (showActiveOnly) processedMembers = processedMembers.filter((m) => m.ativo)
    if (searchTerm) processedMembers = processedMembers.filter((m) => m.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    if (ministryFilter !== "all") processedMembers = processedMembers.filter((m) => m.ministerios?.some((min) => min.id === Number.parseInt(ministryFilter)))

    // Ordenação
    processedMembers.sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;

      const getDate = (dateString?: string) => dateString ? new Date(dateString).getTime() : 0;

      switch (sortKey) {
        case "nome": return a.nome.localeCompare(b.nome) * order;
          // 2. ALTERAÇÃO: Ordenação de idade baseada na data de nascimento (asc = mais novo primeiro)
        case "idade": return (getDate(b.dataNascimento) - getDate(a.dataNascimento)) * order;
        case "dataNascimento": return (getDate(a.dataNascimento) - getDate(b.dataNascimento)) * order;
        case "ministerios": return ((a.ministerios?.length ?? 0) - (b.ministerios?.length ?? 0)) * order;
        case "status": return (Number(a.ativo) - Number(b.ativo)) * order;
        default: return 0;
      }
    });

    setFilteredMembers(processedMembers)
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }

  const handleNewMember = () => { setEditingMember(null); setIsModalOpen(true); }
  const handleEditMember = (member: Member) => { setEditingMember(member); setIsModalOpen(true); }
  const handleSaveMember = () => { loadData(); setIsModalOpen(false); }

  const handleDeleteMember = async (member: Member) => {
    if (confirm(`Tem certeza que deseja excluir ${member.nome}?`)) {
      try {
        await fetch(`/api/membros/${member.id}`, { method: "DELETE" });
        loadData();
      } catch (error) { console.error("Erro ao excluir membro:", error); }
    }
  }

  if (loading) {
    return (
        <div className="md:ml-64 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary"></div>
        </div>
    )
  }

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <ChevronsUpDown size={16} className="text-gray-500" />;
    return sortOrder === 'asc' ? <ArrowUp size={16} className="text-blue-primary" /> : <ArrowDown size={16} className="text-blue-primary" />;
  }

  const TableHeaderButton = ({ columnKey, label, className }: { columnKey: SortKey, label: string, className?: string }) => (
      <button onClick={() => handleSort(columnKey)} className={`flex items-center gap-2 hover:text-white transition-colors ${sortKey === columnKey ? 'text-white' : ''} ${className}`}>
        {label}
        <SortIcon columnKey={columnKey} />
      </button>
  );

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "nome", label: "Nome" },
    { value: "idade", label: "Idade" },
    { value: "dataNascimento", label: "Nascimento" },
    { value: "ministerios", label: "Ministérios" },
    { value: "status", label: "Status" },
  ];

  return (
      <div className="md:ml-64 min-h-screen">
        <header className="bg-blue-primary border-b border-blue-600/50 p-6 md:p-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">MEMBROS</h1>
              <p className="text-blue-100 font-medium">Gerencie os membros da juventude</p>
            </div>
            <button onClick={handleNewMember} className="bg-white text-blue-primary hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors flex items-center space-x-2 self-start md:self-auto">
              <Plus size={20} />
              <span>Novo Membro</span>
            </button>
          </div>
        </header>

        <section className="p-6 md:p-8 border-b border-gray-700/50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative flex-1 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10 w-full bg-gray-800 border-gray-700/50" />
            </div>
            <div className="flex-1">
              <Select value={ministryFilter} onValueChange={setMinistryFilter}>
                <SelectTrigger className="input-field w-full bg-gray-800 border-gray-700/50 text-light-gray data-[placeholder]:text-gray-400">
                  <Users className="mr-2 text-gray-400" size={16} />
                  <SelectValue placeholder="Filtrar por ministério" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Ministérios</SelectItem>
                  {ministries?.map((m) => (<SelectItem key={m.id} value={m.id.toString()}>{formatMinistryName(m.nome)}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="text-gray-400" size={20} />
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={showActiveOnly} onChange={(e) => setShowActiveOnly(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-primary focus:ring-2 focus:ring-blue-primary" />
                <span className="font-medium text-light-gray">Apenas ativos</span>
              </label>
            </div>
          </div>
        </section>

        <section className="p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-bold text-white">
                {filteredMembers.length} {filteredMembers.length === 1 ? "membro encontrado" : "membros encontrados"}
              </h2>
              {/* 3. CONTROLES DE ORDENAÇÃO PARA MOBILE */}
              <div className="flex w-full items-center gap-2 md:hidden">
                <Select value={sortKey} onValueChange={(v) => handleSort(v as SortKey)}>
                  <SelectTrigger className="input-field flex-1 bg-gray-800 border-gray-700/50">
                    <SelectValue placeholder="Ordenar por..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="bg-gray-800 border-gray-700/50">
                  {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </Button>
              </div>
            </div>

            {/* Tabela Desktop */}
            <div className="hidden md:block card overflow-hidden rounded-lg border border-gray-700/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-700/50 bg-gray-800/50">
                  <tr>
                    <th className="p-4 text-left font-bold text-light-gray"><TableHeaderButton columnKey="nome" label="Nome" /></th>
                    <th className="p-4 text-left font-bold text-light-gray"><TableHeaderButton columnKey="idade" label="Idade" /></th>
                    <th className="p-4 text-left font-bold text-light-gray"><TableHeaderButton columnKey="dataNascimento" label="Nascimento" /></th>
                    {/* 1. ALTERAÇÃO: Classe de largura para a coluna de telefone */}
                    <th className="w-[180px] p-4 text-left font-bold text-light-gray">Telefone</th>
                    <th className="p-4 text-left font-bold text-light-gray"><TableHeaderButton columnKey="ministerios" label="Ministérios" /></th>
                    <th className="p-4 text-left font-bold text-light-gray"><TableHeaderButton columnKey="status" label="Status" /></th>
                    <th className="p-4 text-left font-bold text-light-gray">Ações</th>
                  </tr>
                  </thead>
                  <tbody>
                  {filteredMembers.map((member) => (
                      <tr key={member.id} className="border-b border-gray-700/30 transition-colors hover:bg-gray-800/30">
                        <td className="p-4 font-bold text-white">{member.nome}</td>
                        <td className="p-4 text-gray-400">{member.idade || "-"}</td>
                        <td className="p-4 text-gray-400">{formatDate(member.dataNascimento)}</td>
                        <td className="p-4 text-gray-400">{formatPhoneNumber(member.telefone)}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {member.ministerios?.map((m) => (<Badge key={m.id} className="badge-ministry text-xs">{formatMinistryName(m.nome)}</Badge>))}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={member.ativo ? "badge-active" : "badge-inactive"}>{member.ativo ? "Ativo" : "Inativo"}</Badge>

                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEditMember(member)} className="rounded-lg bg-blue-primary/20 p-2 text-blue-primary transition-colors hover:bg-blue-primary/30"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteMember(member)} className="rounded-lg bg-red-500/20 p-2 text-red-400 transition-colors hover:bg-red-500/30"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cards Mobile */}
            <div className="space-y-4 md:hidden">
              {filteredMembers.map((member) => (
                  <div key={member.id} className="card rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-bold text-white">{member.nome}</h3>
                        <div className="flex flex-col space-y-2 text-sm text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Calendar size={14} />
                            <span>{formatDate(member.dataNascimento)} ({member.idade} anos)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone size={14} />
                            <span>{formatPhoneNumber(member.telefone)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={member.ativo ? "badge-active" : "badge-inactive"}>{member.ativo ? "Ativo" : "Inativo"}</Badge>
                    </div>
                    {member.ministerios && member.ministerios.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {member.ministerios.map((m) => (<Badge key={m.id} className="badge-ministry">{formatMinistryName(m.nome)}</Badge>))}
                          </div>
                        </div>
                    )}
                    <div className="flex space-x-2">
                      <button onClick={() => handleEditMember(member)} className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-blue-primary/20 px-4 py-3 font-medium text-blue-primary transition-colors hover:bg-blue-primary/30">
                        <Edit size={16} /><span>Editar</span>
                      </button>
                      <button onClick={() => handleDeleteMember(member)} className="rounded-xl bg-red-500/20 px-4 py-3 text-red-400 transition-colors hover:bg-red-500/30">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
              ))}
            </div>

            {filteredMembers.length === 0 && (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-700/50">
                    <Users className="text-gray-500" size={32} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-400">Nenhum membro encontrado</h3>
                  <p className="text-gray-500">{searchTerm || ministryFilter !== "all" ? "Tente ajustar seus filtros" : "Comece adicionando um novo membro"}</p>
                </div>
            )}
          </div>
        </section>

        <MemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} member={editingMember} ministries={ministries} onSave={handleSaveMember} />
      </div>
  )
}