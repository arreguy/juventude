"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Users, Calculator, MessageSquare } from "lucide-react"

interface Event {
  id: number;
  data: string;
  categoria: "Culto" | "EBD";
  contagemTotal: number;
  contagemVisitantes?: number;
  observacao?: string;
  operacional?: number;
  recepcao?: number;
  producao?: number;
  louvor?: number;
  midia?: number;
  fotografia?: number;
  intercessao?: number;
  contagemHomens?: number;
  contagemMulheres?: number;
}

interface EventFormProps {
  eventType: string
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Event | null
}

const getInitialFormData = () => ({
  data: "",
  contagemTotal: "",
  visitantes: "",
  observacao: "",
  operacional: "",
  recepcao: "",
  producao: "",
  louvor: "",
  midia: "",
  fotografia: "",
  intercessao: "",
  contagemHomens: "",
  contagemMulheres: "",
});

export function EventForm({ eventType, onSuccess, onCancel, initialData }: EventFormProps) {
  const [formData, setFormData] = useState(getInitialFormData())
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        data: initialData.data.split('T')[0] || "",
        contagemTotal: initialData.contagemTotal?.toString() || "",
        visitantes: initialData.contagemVisitantes?.toString() || "",
        observacao: initialData.observacao || "",
        operacional: initialData.operacional?.toString() || "",
        recepcao: initialData.recepcao?.toString() || "",
        producao: initialData.producao?.toString() || "",
        louvor: initialData.louvor?.toString() || "",
        midia: initialData.midia?.toString() || "",
        fotografia: initialData.fotografia?.toString() || "",
        intercessao: initialData.intercessao?.toString() || "",
        contagemHomens: initialData.contagemHomens?.toString() || "",
        contagemMulheres: initialData.contagemMulheres?.toString() || "",
      })
    } else {
      setFormData(getInitialFormData());
    }
  }, [initialData])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cultoPayload = {
      data: formData.data,
      contagemTotal: parseInt(formData.contagemTotal) || 0,
      visitantes: parseInt(formData.visitantes) || 0,
      operacional: parseInt(formData.operacional) || 0,
      recepcao: parseInt(formData.recepcao) || 0,
      producao: parseInt(formData.producao) || 0,
      louvor: parseInt(formData.louvor) || 0,
      midia: parseInt(formData.midia) || 0,
      fotografia: parseInt(formData.fotografia) || 0,
      intercessao: parseInt(formData.intercessao) || 0,
      observacao: formData.observacao,
    }

    const ebdPayload = {
      data: formData.data,
      contagemHomens: parseInt(formData.contagemHomens) || 0,
      contagemMulheres: parseInt(formData.contagemMulheres) || 0,
      observacao: formData.observacao,
    }

    try {
      const endpoint = isEditing ? `/api/eventos/${initialData.id}` : (eventType === "culto" ? "/api/eventos/culto" : "/api/eventos/ebd");
      const method = isEditing ? "PUT" : "POST";
      const payload = eventType === "culto" ? cultoPayload : ebdPayload;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert(`Evento ${isEditing ? 'atualizado' : 'registrado'} com sucesso!`);
        if (onSuccess) onSuccess();
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar evento: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error("Erro ao registrar evento:", error)
      alert("Erro ao registrar evento")
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (eventType === "ebd" && (field === "contagemHomens" || field === "contagemMulheres")) {
      const homens = field === "contagemHomens" ? Number(value) || 0 : Number(formData.contagemHomens) || 0
      const mulheres = field === "contagemMulheres" ? Number(value) || 0 : Number(formData.contagemMulheres) || 0
      setFormData((prev) => ({ ...prev, contagemTotal: (homens + mulheres).toString() }))
    }
  }

  return (
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isEditing ? `EDITAR ${eventType.toUpperCase()}` : `REGISTRO DE ${eventType.toUpperCase()}`}
          </h2>
          <p className="text-gray-400 font-medium">
            Preencha os dados do evento abaixo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-light-gray mb-2">Data *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="date"
                    required
                    value={formData.data}
                    onChange={(e) => updateField("data", e.target.value)}
                    className="input-field w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-gray mb-2">
                {eventType === "culto" ? "Total de Pessoas" : "Total Geral"}
              </label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="number"
                    min="0"
                    required
                    value={formData.contagemTotal}
                    onChange={(e) => updateField("contagemTotal", e.target.value)}
                    className={`input-field w-full pl-10 ${eventType === "ebd" ? "bg-gray-700/50" : ""}`}
                    readOnly={eventType === "ebd"}
                    placeholder="0"
                />
              </div>
            </div>

            {eventType === "culto" && (
                <div>
                  <label className="block text-sm font-medium text-light-gray mb-2">Visitantes</label>
                  <input
                      type="number"
                      min="0"
                      value={formData.visitantes}
                      onChange={(e) => updateField("visitantes", e.target.value)}
                      className="input-field w-full"
                      placeholder="0"
                  />
                </div>
            )}
          </div>

          {/* EBD Specific Fields */}
          {eventType === "ebd" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Users size={20} />
                  <span>Contagem</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-light-gray mb-2">Homens</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.contagemHomens}
                        onChange={(e) => updateField("contagemHomens", e.target.value)}
                        className="input-field w-full"
                        placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-gray mb-2">Mulheres</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.contagemMulheres}
                        onChange={(e) => updateField("contagemMulheres", e.target.value)}
                        className="input-field w-full"
                        placeholder="0"
                    />
                  </div>
                </div>
              </div>
          )}

          {/* Culto Specific Fields */}
          {eventType === "culto" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Users size={20} />
                  <span>Voluntários por Ministério</span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: "operacional", label: "Operacional" },
                    { key: "recepcao", label: "Recepção" },
                    { key: "producao", label: "Produção" },
                    { key: "louvor", label: "Louvor" },
                    { key: "midia", label: "Criativo" },
                    { key: "fotografia", label: "Fotografia" },
                    { key: "intercessao", label: "Intercessão" },
                  ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-light-gray mb-2">{field.label}</label>
                        <input
                            type="number"
                            min="0"
                            value={formData[field.key as keyof typeof formData] as string}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            className="input-field w-full"
                            placeholder="0"
                        />
                      </div>
                  ))}
                </div>
              </div>
          )}

          {/* Observations */}
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">Observações (opcional)</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-gray-400" size={16} />
              <textarea
                  value={formData.observacao}
                  onChange={(e) => updateField("observacao", e.target.value)}
                  className="input-field w-full pl-10 min-h-[100px] resize-none"
                  placeholder="Algum detalhe importante sobre o evento..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-700/50 space-x-3">
            {isEditing && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-700 hover:bg-gray-600 text-light-gray font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
            )}
            <button
                type="submit"
                className="bg-pink-vibrant hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              {isEditing ? "Atualizar" : "Registrar"} {eventType === "culto" ? "Culto" : "EBD"}
            </button>
          </div>
        </form>
      </div>
  )
}