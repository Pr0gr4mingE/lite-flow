import { KanbanBoard } from '@/components/features/pipeline/kanban-board';
import { jsonDb } from '@/infrastructure/database/json-client';
import { BotaoNovaNegociacao } from '@/components/features/pipeline/botao-nova-negociacao';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { KanbanColumnProps } from '@/shared/types/ui/kanban-board.props'; // <-- Importação da tipagem real

// 1. Tipagem exata sem uso de 'any'
export interface QuadroProps {
  id: string;
  titulo: string;
  donoId: string;
  membrosIds: string[];
  colunas: KanbanColumnProps[]; // <-- Substituído any[] por KanbanColumnProps[]
}

// 2. Essa é a nova estrutura raiz do seu db.json
export interface BancoDeDados {
  quadros: QuadroProps[];
}

export default async function KanbanPage() {
  // Verifica a sessão (O "Crachá")
  const cookieStore = await cookies();
  const userId = cookieStore.get("crm_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  // 3. Lemos o banco e usamos o Double Cast (unknown -> BancoDeDados) para o TypeScript aceitar a nova estrutura
  const banco = (await jsonDb.ler()) as unknown as BancoDeDados;

  // 4. Agora o TypeScript sabe que .quadros existe!
  const quadros = banco.quadros || [];
  
  // 5. Encontramos o quadro do usuário
  const quadroDoUsuario = quadros.find((q: QuadroProps) => q.membrosIds.includes(userId));

  const colunasIniciais = quadroDoUsuario ? quadroDoUsuario.colunas : [];

  return (
    <div className="h-full flex flex-col">
      {/* CABEÇALHO */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {quadroDoUsuario ? quadroDoUsuario.titulo : "Quadro Kanban"}
          </h1>
        </div>
        
        <BotaoNovaNegociacao />
      </div>

      {/* ÁREA DO BOARD */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <KanbanBoard colunasIniciais={colunasIniciais} />
      </div>
    </div>
  );
}