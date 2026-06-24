"use server";

import { jsonDb } from "@/infrastructure/database/json-client";
import { revalidatePath } from "next/cache";
import { KanbanColumnProps} from "@/shared/types/ui/kanban-board.props";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";
import { AtividadeReuniao } from "@/hooks/leads/use-leads";
import { TarefaCliente, StatusNegociacao } from "@/hooks/clientes/use-clientes";

// Estendemos o card padrão para o TypeScript aceitar a inserção dos novos dados
interface CardAtualizavel extends KanbanCardProps {
  atividades?: AtividadeReuniao[];
  tarefas?: TarefaCliente[];
  statusNegociacao?: StatusNegociacao;
}

// Ação 1: Salvar Reunião do Lead
export async function agendarReuniaoAction(leadId: string | number, novaReuniao: AtividadeReuniao) {
  const banco = await jsonDb.ler();
  let alterado = false;

  banco.colunas.forEach((coluna: KanbanColumnProps) => {
    coluna.cards.forEach((cardBase: KanbanCardProps) => {
      const card = cardBase as CardAtualizavel;
      
      if (card.id === leadId) {
        if (!card.atividades) card.atividades = [];
        card.atividades.push(novaReuniao);
        alterado = true;
      }
    });
  });

  if (alterado) {
    await jsonDb.salvar(banco); // Ajuste para "escrever" ou "salvar" dependendo de como está o seu json-client
    revalidatePath('/leads');
    revalidatePath('/tarefas');
  }
}

// Ação 2: Atualizar Status do Cliente
export async function atualizarStatusClienteAction(clienteId: string | number, novoStatus: StatusNegociacao) {
  const banco = await jsonDb.ler();
  let alterado = false;

  banco.colunas.forEach((coluna: KanbanColumnProps) => {
    coluna.cards.forEach((cardBase: KanbanCardProps) => {
      const card = cardBase as CardAtualizavel;
      
      if (card.id === clienteId) {
        card.statusNegociacao = novoStatus;
        alterado = true;
      }
    });
  });

  if (alterado) {
    await jsonDb.salvar(banco); // Ajuste para "escrever" ou "salvar"
    revalidatePath('/clientes');
  }
}

// Ação 3: Salvar Tarefa do Cliente
export async function adicionarTarefaClienteAction(clienteId: string | number, novaTarefa: TarefaCliente) {
  const banco = await jsonDb.ler();
  let alterado = false;

  banco.colunas.forEach((coluna: KanbanColumnProps) => {
    coluna.cards.forEach((cardBase: KanbanCardProps) => {
      const card = cardBase as CardAtualizavel;
      
      if (card.id === clienteId) {
        if (!card.tarefas) card.tarefas = [];
        card.tarefas.push(novaTarefa);
        alterado = true;
      }
    });
  });

  if (alterado) {
    await jsonDb.salvar(banco); // Ajuste para "escrever" ou "salvar"
    revalidatePath('/clientes');
    revalidatePath('/tarefas');
  }
}