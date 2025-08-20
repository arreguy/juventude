import Link from "next/link"
import { Users, Calendar, BarChart3, Settings } from "lucide-react"

// A URL base da API agora é tratada pelo proxy do Next.js.
// Usaremos caminhos relativos para as chamadas fetch.

// Função para buscar os dados da API de forma segura
async function getStats(path: string): Promise<number> {
  try {
    // Usamos 'no-store' para garantir que os dados sejam sempre os mais recentes
    // Para server-side, usamos a URL completa do backend
    const apiUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:8080${path}` 
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${path}`;
    
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Erro ao buscar ${path}:`, response.statusText);
      return 0; // Retorna 0 em caso de erro na resposta
    }
    // A resposta pode ser um array ou um número direto (ex: count)
    const data = await response.json();
    return Array.isArray(data) ? data.length : typeof data === 'number' ? data : 0;
  } catch (error) {
    console.error(`Falha na requisição para ${path}:`, error);
    return 0; // Retorna 0 se a requisição falhar (ex: API offline)
  }
}

// Transformamos o componente em uma função assíncrona
export default async function HomePage() {
  // Busca todos os dados em paralelo para melhor performance
  const [membersCount, ministriesCount, eventsCount] = await Promise.all([
    getStats("/api/membros"),
    getStats("/api/ministerios"),
    getStats("/api/eventos"),
  ]);

  const quickActions = [
    {
      title: "Gestão de Membros",
      description: "Cadastre e gerencie membros",
      href: "/membros",
      icon: Users,
      color: "bg-blue-primary",
      stats: `${membersCount} ${membersCount === 1 ? 'membro' : 'membros'}`, // Stats dinâmicos
    },
    {
      title: "Gestão de Ministérios",
      description: "Organize e gerencie ministérios",
      href: "/ministerios",
      icon: Settings,
      color: "bg-gray-600",
      stats: `${ministriesCount - 1} ${ministriesCount - 1 === 1 ? 'ministério' : 'ministérios'}`, // Stats dinâmicos
    },
    {
      title: "Registro de Eventos",
      description: "Registre cultos, EBD e eventos",
      href: "/eventos",
      icon: Calendar,
      color: "bg-pink-vibrant",
      stats: `${eventsCount} ${eventsCount === 1 ? 'evento' : 'eventos'}`, // Stats dinâmicos
    },
    {
      title: "Relatórios",
      description: "Visualize estatísticas e relatórios",
      href: "/relatorios",
      icon: BarChart3,
      color: "bg-yellow-muted text-black",
      stats: "Em breve",
    },
  ]

  return (
      <div className="md:ml-64 min-h-screen">
        {/* Quick Actions */}
        <section className="p-6 md:p-8 flex-1 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                    <Link
                        key={index}
                        href={action.href}
                        className="group card card-hover animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                          className={`${action.color} rounded-xl p-4 mb-6 w-fit group-hover:scale-105 transition-transform duration-200`}
                      >
                        <Icon className="text-white" size={32} />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                        {action.title}
                      </h3>

                      <p className="text-gray-400 mb-6 leading-relaxed">{action.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-primary font-bold">{action.stats}</span>
                        <div className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-200">
                          <span className="text-lg font-bold">→</span>
                        </div>
                      </div>
                    </Link>
                )
              })}
            </div>
          </div>
        </section>
      </div>
  )
}