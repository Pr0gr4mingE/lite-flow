export default function PipelineDashboardPage() {
  // Métricas simuladas
  const metricas = [
    { titulo: 'Total em Negociação', valor: 'R$ 27.900,00', cor: 'text-blue-600' },
    { titulo: 'Negócios Fechados (Mês)', valor: 'R$ 12.400,00', cor: 'text-green-600' },
    { titulo: 'Taxa de Conversão', valor: '32%', cor: 'text-gray-800' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard do Pipeline</h1>
        <p className="text-sm text-gray-500 mt-1">
          Visão geral do desempenho de vendas e saúde do funil.
        </p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricas.map((metrica) => (
          <div key={metrica.titulo} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{metrica.titulo}</h3>
            <p className={`text-3xl font-bold mt-2 ${metrica.cor}`}>
              {metrica.valor}
            </p>
          </div>
        ))}
      </div>

      {/* Representação visual do Funil (Gráfico simulado) */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Saúde do Funil (Qtd. de Negócios)</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-gray-600">Prospecção (15)</span>
            <div className="flex-1 ml-4 h-6 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-full rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-gray-600">Proposta (8)</span>
            <div className="flex-1 ml-4 h-6 border border-transparent">
              {/* Calcula a largura proporcional para dar o efeito de funil */}
              <div className="h-full bg-yellow-400 w-3/5 rounded-full mx-auto"></div>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-gray-600">Fechamento (3)</span>
            <div className="flex-1 ml-4 h-6 border border-transparent">
              <div className="h-full bg-green-500 w-1/4 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}