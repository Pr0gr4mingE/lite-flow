import { obterMetricasDoPipeline } from "@/services/dashboard.service";
import { jsonDb } from "@/infrastructure/database/json-client";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 1. Tipagens para o TypeScript entender a nova estrutura
interface QuadroProps {
  id: string;
  membrosIds: string[];
  colunas: KanbanColumnProps[];
}

interface BancoDeDadosProps {
  quadros: QuadroProps[];
}

export default async function PipelineDashboardPage() {
  // 2. Controle de Sessão e Isolamento
  const cookieStore = await cookies();
  const userId = cookieStore.get("crm_session")?.value;

  if (!userId) redirect("/login");

  // 3. Lê o banco usando o Double Cast
  const banco = (await jsonDb.ler()) as unknown as BancoDeDadosProps;
  
  const quadros = banco.quadros || [];
  const quadroDoUsuario = quadros.find((q: QuadroProps) => q.membrosIds.includes(userId));

  if (!quadroDoUsuario) redirect("/login");

  // 4. Isolamos as colunas exclusivas deste usuário
  const colunas = quadroDoUsuario.colunas;

  // 5. Passamos as colunas do usuário para o serviço calcular as métricas apenas dele!
  const metricas = await obterMetricasDoPipeline(colunas);

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

      {/* Cards de Métricas Principais */}
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
                
                <div className="flex-1 ml-4 h-6 flex justify-center bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <div 
                    className={`h-full ${corBarra} rounded-full transition-all duration-700 ease-in-out`}
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