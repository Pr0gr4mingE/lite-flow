"use server";

import { jsonDb } from "@/infrastructure/database/json-client";

export async function moverNegociacaoAction(
  cardId: number, 
  idColunaOrigem: string, 
  idColunaDestino: string, 
  novoIndex: number
) {
  try {
    const banco = await jsonDb.ler();
    
    // Como 'banco' é tipado, o TS sabe que 'c' é um KanbanColumnProps automaticamente!
    const colunaOrigem = banco.colunas.find(c => c.idDaColuna === idColunaOrigem);
    const colunaDestino = banco.colunas.find(c => c.idDaColuna === idColunaDestino);

    if (!colunaOrigem || !colunaDestino) {
      throw new Error("Colunas não encontradas");
    }

    // O TS sabe que 'c' aqui é um KanbanCardProps!
    const indexDoCardNaOrigem = colunaOrigem.cards.findIndex(c => c.id === cardId);
    
    if (indexDoCardNaOrigem === -1) {
       throw new Error("Card não encontrado na coluna de origem");
    }

    const [cardMovido] = colunaOrigem.cards.splice(indexDoCardNaOrigem, 1);

    colunaDestino.cards.splice(novoIndex, 0, cardMovido);

    await jsonDb.salvar(banco);

    return { sucesso: true, mensagem: "Card salvo com sucesso no JSON!" };

  } catch (erro) {
    console.error("Erro na action:", erro);
    return { sucesso: false, mensagem: "Falha ao mover card no servidor." };
  }
}