import { jsonDb } from "@/infrastructure/database/json-client";
import { TarefasClient, TarefaUnificada } from "@/components/features/tarefas/tarefas-client";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";
import { AtividadeReuniao } from "@/hooks/leads/use-leads";
import { TarefaCliente } from "@/hooks/clientes/use-clientes";

// Estendemos o card padrão para avisar ao TypeScript que ele pode ter essas listas novas
interface CardComAtividades extends KanbanCardProps {
  atividades?: AtividadeReuniao[];
  tarefas?: TarefaCliente[];
}

export default async function TarefasPage() {
  const banco = await jsonDb.ler();
  const tarefasUnificadas: TarefaUnificada[] = [];

  // Tipando a coluna
  banco.colunas.forEach((coluna: KanbanColumnProps) => {
    // Tipando o card com a nossa interface estendida
    coluna.cards.forEach((cardBase: KanbanCardProps) => {
      const card = cardBase as CardComAtividades;
      
      // 1. Extrai Reuniões dos Leads (Prospecção)
      if (card.atividades && card.atividades.length > 0) {
        // Tipando a atividade
        card.atividades.forEach((ativ: AtividadeReuniao) => {
          tarefasUnificadas.push({
            id: ativ.id,
            tipo: 'reuniao',
            descricao: ativ.assunto,
            data: ativ.data,
            cardId: card.id,
            cardTitulo: card.titulo,
            origem: `Lead em ${coluna.titulo}`,
          });
        });
      }

      // 2. Extrai Tarefas de Clientes (Pós-venda / Fechamento)
      if (card.tarefas && card.tarefas.length > 0) {
        // Tipando a tarefa
        card.tarefas.forEach((tarefa: TarefaCliente) => {
          tarefasUnificadas.push({
            id: tarefa.id,
            tipo: tarefa.tipo,
            descricao: tarefa.descricao,
            data: tarefa.data,
            cardId: card.id,
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