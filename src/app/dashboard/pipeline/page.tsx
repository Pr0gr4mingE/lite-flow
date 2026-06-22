import { obterMetricasDoPipeline } from "@/services/dashboard.service";
import { jsonDb } from "@/infrastructure/database/json-client";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";

export default async function PipelineDashboardPage() {
  // 1. Lê os 3 cards do topo usando o serviço que já criamos
  const metricas = await obterMetricasDoPipeline();

  // 2. Lê os dados brutos do banco para desenhar o gráfico do funil
  const banco = await jsonDb.ler();
  const colunas: KanbanColumnProps[] = banco.colunas;

  // Descobre qual coluna tem mais cards para definir ela como o 100% da largura da barra
  const maxCards = Math.max(...colunas.map(c => c.cards.length), 1);

  // Paleta de cores dinâmica baseada na ordem das colunas
  const coresFunil = ["bg-blue-500", "bg-yellow-400", "bg-green-500", "bg-purple-500"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard do Pipeline</h1>
        <p className="text-sm text-gray-500 mt-1">
          Visão geral do desempenho de vendas e saúde do funil.
        </p>
      </div>

      {/* Cards de Métricas Principais (Agora conectados ao banco!) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricas.map((metrica) => (
          <div key={metrica.titulo} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-500">{metrica.titulo}</h3>
            <p className={`text-3xl font-bold mt-2 ${metrica.cor}`}>
              {metrica.valor}
            </p>
          </div>
        ))}
      </div>

      {/* Representação visual do Funil Dinâmico */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Saúde do Funil (Qtd. de Negócios)</h3>
        
        <div className="space-y-4">
          {colunas.map((coluna, index) => {
            const qtd = coluna.cards.length;
            
            // Regra de 3 simples para saber a porcentagem da barra
            const larguraPorcentagem = Math.round((qtd / maxCards) * 100);
            const corBarra = coresFunil[index] || "bg-gray-400";
            
            return (
              <div key={coluna.idDaColuna} className="flex items-center">
                <span className="w-32 text-sm font-medium text-gray-600 truncate pr-2" title={coluna.titulo}>
                  {coluna.titulo} ({qtd})
                </span>
                
                {/* Container flexível que centraliza a barra para criar o formato de \ / */}
                <div className="flex-1 ml-4 h-6 flex justify-center bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <div 
                    className={`h-full ${corBarra} rounded-full transition-all duration-700 ease-in-out`}
                    // O style inline é usado aqui porque as classes do Tailwind não suportam larguras dinâmicas exatas calculadas no JS
                    style={{ width: `${larguraPorcentagem}%` }} 
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}