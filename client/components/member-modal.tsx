"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, User, Phone, Users } from "lucide-react"

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

interface MemberModalProps {
  isOpen: boolean
  onClose: () => void
  member: Member | null
  ministries: Ministry[]
  onSave: () => void
}

export function MemberModal({ isOpen, onClose, member, ministries, onSave }: MemberModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    telefone: "",
    dataNascimento: "",
    ativo: true,
    ministerioIds: [] as number[],
  })

  useEffect(() => {
    if (member) {
      setFormData({
        nome: member.nome,
        idade: member.idade?.toString() || "",
        telefone: member.telefone || "",
        dataNascimento: member.dataNascimento || "",
        ativo: member.ativo,
        ministerioIds: member.ministerios?.map((m) => m.id) || [],
      })
    } else {
      setFormData({
        nome: "",
        idade: "",
        telefone: "",
        dataNascimento: "",
        ativo: true,
        ministerioIds: [],
      })
    }
  }, [member])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      nome: formData.nome,
      idade: formData.idade ? Number.parseInt(formData.idade) : null,
      telefone: formData.telefone || null,
      dataNascimento: formData.dataNascimento || null,
      ativo: formData.ativo,
      ministerioIds: formData.ministerioIds,
    }

    try {
      const url = member ? `/api/membros/${member.id}` : "/api/membros"
      const method = member ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        onSave()
        onClose()
      }
    } catch (error) {
      console.error("Erro ao salvar membro:", error)
    }
  }

  const handleMinistryToggle = (ministryId: number) => {
    setFormData((prev) => ({
      ...prev,
      ministerioIds: prev.ministerioIds.includes(ministryId)
        ? prev.ministerioIds.filter((id) => id !== ministryId)
        : [...prev.ministerioIds, ministryId],
    }))
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    const age = today.getFullYear() - birth.getFullYear()
    setFormData((prev) => ({ ...prev, idade: age.toString() }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 relative z-10">
          <h2 className="text-2xl font-bold text-white">{member ? "Editar Membro" : "Novo Membro"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-xl transition-colors">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <User size={20} />
              <span>Informações Básicas</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-light-gray mb-2">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                  className="input-field w-full"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-gray mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, dataNascimento: e.target.value }))
                    if (e.target.value) calculateAge(e.target.value)
                  }}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-gray mb-2">Idade</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={formData.idade}
                  onChange={(e) => setFormData((prev) => ({ ...prev, idade: e.target.value }))}
                  className="input-field w-full"
                  placeholder="Idade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-gray mb-2">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, telefone: e.target.value }))}
                    className="input-field w-full pl-10"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-gray mb-2">Status</label>
                <select
                  value={formData.ativo.toString()}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ativo: e.target.value === "true" }))}
                  className="input-field w-full"
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ministries */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users size={20} />
              <span>Ministérios</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ministries.map((ministry) => (
                <label
                  key={ministry.id}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.ministerioIds.includes(ministry.id)}
                    onChange={() => handleMinistryToggle(ministry.id)}
                    className="w-4 h-4 text-blue-primary bg-gray-700 border-gray-600 rounded focus:ring-blue-primary focus:ring-2"
                  />
                  <span className="text-light-gray font-medium">{ministry.nome}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-3 pt-6 border-t border-gray-700/50">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 md:flex-none">
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1">
              {member ? "Atualizar" : "Criar"} Membro
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
