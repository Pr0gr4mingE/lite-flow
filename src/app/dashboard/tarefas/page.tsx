import { jsonDb } from "@/infrastructure/database/json-client";
import { TarefasClient, TarefaUnificada } from "@/components/features/tarefas/tarefas-client";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";
import { AtividadeReuniao } from "@/hooks/leads/use-leads";
import { TarefaCliente } from "@/hooks/clientes/use-clientes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Estendemos o card padrão para avisar ao TypeScript que ele pode ter essas listas novas
interface CardComAtividades extends KanbanCardProps {
  atividades?: AtividadeReuniao[];
  tarefas?: TarefaCliente[];
}

// Tipagens do novo banco Multi-Tenant
interface QuadroProps {
  id: string;
  membrosIds: string[];
  colunas: KanbanColumnProps[];
}

interface BancoDeDadosProps {
  quadros: QuadroProps[];
}

export default async function TarefasPage() {
  // 1. Controle de Sessão e Isolamento
  const cookieStore = await cookies();
  const userId = cookieStore.get("crm_session")?.value;

  if (!userId) redirect("/login");

  // 2. Lê o banco estruturado
  const banco = (await jsonDb.ler()) as unknown as BancoDeDadosProps;
  
  // 3. Encontra apenas o quadro deste usuário
  const quadros = banco.quadros || [];
  const quadroDoUsuario = quadros.find((q: QuadroProps) => q.membrosIds.includes(userId));

  if (!quadroDoUsuario) redirect("/login");

  const tarefasUnificadas: TarefaUnificada[] = [];

  // 4. Varre APENAS as colunas do usuário logado
  quadroDoUsuario.colunas.forEach((coluna: KanbanColumnProps) => {
    coluna.cards.forEach((cardBase: KanbanCardProps) => {
      const card = cardBase as CardComAtividades;
      
      // Extrai Reuniões dos Leads (Prospecção)
      if (card.atividades && card.atividades.length > 0) {
        card.atividades.forEach((ativ: AtividadeReuniao) => {
          tarefasUnificadas.push({
            id: ativ.id,
            tipo: 'reuniao',
            descricao: ativ.assunto,
            data: ativ.data,
            cardId: String(card.id), // Garantindo que o ID vai como string
            cardTitulo: card.titulo,
            origem: `Lead em ${coluna.titulo}`,
          });
        });
      }

      // Extrai Tarefas de Clientes (Pós-venda / Fechamento)
      if (card.tarefas && card.tarefas.length > 0) {
        card.tarefas.forEach((tarefa: TarefaCliente) => {
          tarefasUnificadas.push({
            id: tarefa.id,
            tipo: tarefa.tipo,
            descricao: tarefa.descricao,
            data: tarefa.data,
            cardId: String(card.id), // Garantindo que o ID vai como string
            cardTitulo: card.titulo,
            origem: `Cliente (${coluna.titulo})`,
          });
        });
      }
    });
  });

  tarefasUnificadas.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  return (
    <div className="h-full flex flex-col space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tarefas e Atividades</h1>
        <p className="text-gray-500 mt-1">
          Visão unificada de todos os seus compromissos, reuniões e lembretes.
        </p>
      </div>

      <TarefasClient tarefas={tarefasUnificadas} />
    </div>
  );
}