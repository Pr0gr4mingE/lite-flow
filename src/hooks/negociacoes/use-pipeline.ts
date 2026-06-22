"use client";

import { useState } from "react";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { DropResult } from "@hello-pangea/dnd";
import toast from "react-hot-toast"; // 1. Importa a função toast

export function usePipeline(colunasIniciais: KanbanColumnProps[]) {
  const [colunas, setColunas] = useState<KanbanColumnProps[]>(colunasIniciais);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const novasColunas = [...colunas];
    const colunaOrigem = novasColunas.find(col => col.idDaColuna === source.droppableId);
    const colunaDestino = novasColunas.find(col => col.idDaColuna === destination.droppableId);

    if (!colunaOrigem || !colunaDestino) return;

    const [cardMovido] = colunaOrigem.cards.splice(source.index, 1);
    colunaDestino.cards.splice(destination.index, 0, cardMovido);

    setColunas(novasColunas);

    // 2. Dispara o feedback visual
    toast.success(`Movido para ${colunaDestino.titulo}!`, {
      style: {
        borderRadius: '8px',
        background: '#333',
        color: '#fff',
      },
    });

    // Lembrete: A Server Action para salvar no banco JSON será chamada aqui depois!
  };

  return {
    colunas,
    onDragEnd
  };
}