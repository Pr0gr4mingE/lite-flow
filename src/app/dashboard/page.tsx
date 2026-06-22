export default function DashboardRootPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-500 mt-1">Bem-vindo de volta! Aqui está o resumo das suas operações.</p>
      </div>

      {/* Grid de Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Negociações Abertas</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Novos Leads</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Clientes Ativos</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">8</p>
        </div>
      </div>

      <div className="mt-10 flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex items-center justify-center">
        <p className="text-gray-400">
          Gráficos e relatórios entrarão aqui no futuro.
        </p>
      </div>
    </div>
  );
}