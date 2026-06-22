"use server";

import { jsonDb } from "@/infrastructure/database/json-client";
import { revalidatePath } from "next/cache";
// 1. Importando os tipos corretos
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";

export async function atualizarPipelineAction(
  cardId: number | string, 
  idColunaOrigem: string, 
  idColunaDestino: string, 
  novoIndex: number
) {
  try {
    const banco = await jsonDb.ler();
    
    // 2. Substituindo (c: any) pelo tipo da coluna
    const colunaOrigem = banco.colunas.find((c: KanbanColumnProps) => c.idDaColuna === idColunaOrigem);
    const colunaDestino = banco.colunas.find((c: KanbanColumnProps) => c.idDaColuna === idColunaDestino);

    if (!colunaOrigem || !colunaDestino) throw new Error("Colunas não encontradas");

    // 3. Substituindo (c: any) pelo tipo do card
    const indexDoCardNaOrigem = colunaOrigem.cards.findIndex((c: KanbanCardProps) => c.id === cardId);
    if (indexDoCardNaOrigem === -1) throw new Error("Card não encontrado");

    // Remove da origem e insere no destino cirurgicamente
    const [cardMovido] = colunaOrigem.cards.splice(indexDoCardNaOrigem, 1);
    colunaDestino.cards.splice(novoIndex, 0, cardMovido);

    await jsonDb.salvar(banco);

    // Atualiza as telas que dependem desses dados
    revalidatePath("/dashboard/kanban");
    revalidatePath("/dashboard");

    return { sucesso: true };
  } catch (erro) {
    console.error("Erro ao atualizar pipeline:", erro);
    return { sucesso: false, mensagem: "Falha ao mover card no servidor." };
  }
}