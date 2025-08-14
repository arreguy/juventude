"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Settings, FileText } from "lucide-react"

interface Ministry {
  id: number
  nome: string
  descricao?: string
  cor?: string
}

interface MinistryModalProps {
  isOpen: boolean
  onClose: () => void
  ministry: Ministry | null
  onSave: () => void
}

export function MinistryModal({ isOpen, onClose, ministry, onSave }: MinistryModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    cor: "#4f76f2",
  })

  useEffect(() => {
    if (ministry) {
      setFormData({
        nome: ministry.nome,
        descricao: ministry.descricao || "",
        cor: ministry.cor || "#4f76f2",
      })
    } else {
      setFormData({
        nome: "",
        descricao: "",
        cor: "#4f76f2",
      })
    }
  }, [ministry])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      nome: formData.nome,
      descricao: formData.descricao || null,
      cor: formData.cor,
    }

    try {
      const url = ministry ? `/api/ministerios/${ministry.id}` : "/api/ministerios"
      const method = ministry ? "PUT" : "POST"

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
      console.error("Erro ao salvar ministério:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 relative z-10">
          <h2 className="text-2xl font-bold text-white">{ministry ? "Editar Ministério" : "Novo Ministério"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-xl transition-colors">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Settings size={20} />
              <span>Informações do Ministério</span>
            </h3>

            <div>
              <label className="block text-sm font-medium text-light-gray mb-2">Nome *</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                className="input-field w-full"
                placeholder="Nome do ministério"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-gray mb-2">Descrição</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                  className="input-field w-full pl-10 min-h-[100px] resize-none"
                  placeholder="Descrição do ministério (opcional)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-gray mb-2">Cor do Ministério</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.cor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cor: e.target.value }))}
                  className="w-12 h-12 rounded-xl border border-gray-600 bg-gray-800 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.cor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cor: e.target.value }))}
                  className="input-field flex-1"
                  placeholder="#4f76f2"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-3 pt-6 border-t border-gray-700/50">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 md:flex-none">
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1">
              {ministry ? "Atualizar" : "Criar"} Ministério
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
