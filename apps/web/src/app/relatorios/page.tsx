export default function ReportsPage() {
  return (
    <div className="md:ml-64 min-h-screen">
      {/* Header */}
      <header className="bg-yellow-muted border-b border-yellow-600/50 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black text-black mb-2">RELATÓRIOS</h1>
          <p className="text-yellow-900 font-medium">Visualize estatísticas e relatórios detalhados</p>
        </div>
      </header>

      {/* Coming Soon */}
      <section className="p-6 md:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card">
            <div className="py-12">
              <div className="w-24 h-24 bg-yellow-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Relatórios</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto font-medium">
                Trabalho em Progresso
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
