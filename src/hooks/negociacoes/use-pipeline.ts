"use client";

import { useState } from "react";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { DropResult } from "@hello-pangea/dnd";

export function usePipeline(colunasIniciais: KanbanColumnProps[]) {
  const [colunas, setColunas] = useState<KanbanColumnProps[]>(colunasIniciais);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Se soltou fora de uma coluna, não faz nada
    if (!destination) return;

    // Se soltou no mesmo lugar, não faz nada
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Lógica de reordenação local (Mock)
    const novasColunas = [...colunas];
    const colunaOrigem = novasColunas.find(col => col.idDaColuna === source.droppableId);
    const colunaDestino = novasColunas.find(col => col.idDaColuna === destination.droppableId);

    if (!colunaOrigem || !colunaDestino) return;

    // Remove o card da coluna de origem e insere na coluna de destino
    const [cardMovido] = colunaOrigem.cards.splice(source.index, 1);
    colunaDestino.cards.splice(destination.index, 0, cardMovido);

    setColunas(novasColunas);

    // Aqui, no futuro, chamaremos a Server Action para salvar no Drizzle!
    // console.log(`Card ${cardMovido.id} movido para ${colunaDestino.titulo}`);
  };

  return {
    colunas,
    onDragEnd
  };
}