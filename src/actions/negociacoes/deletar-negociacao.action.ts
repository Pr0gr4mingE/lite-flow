"use server";

import { jsonDb } from "@/infrastructure/database/json-client";
import { revalidatePath } from "next/cache";
// 1. Importando os tipos corretos
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";

export async function deletarNegociacaoAction(cardId: number | string) {
  try {
    const banco = await jsonDb.ler();
    let cardDeletado = false;

    // 2. Tipamos a 'coluna' no loop
    for (const coluna of banco.colunas as KanbanColumnProps[]) {
      // 3. Substituímos (c: any) pelo tipo do card
      const index = coluna.cards.findIndex((c: KanbanCardProps) => c.id === cardId);
      
      if (index !== -1) {
        coluna.cards.splice(index, 1);
        cardDeletado = true;
        break; // Sai do loop pois já achou e deletou
      }
    }

    if (!cardDeletado) {
      return { sucesso: false, mensagem: "Card não encontrado para exclusão." };
    }

    await jsonDb.salvar(banco);

    revalidatePath("/dashboard/kanban");
    revalidatePath("/dashboard");

    return { sucesso: true };
  } catch (erro) {
    console.error("Erro ao deletar card:", erro);
    return { sucesso: false, mensagem: "Falha ao deletar o card no servidor." };
  }
}