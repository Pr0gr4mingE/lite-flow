"use client";

import { useState } from "react";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props"; // Ajuste se necessário
import { DropResult } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
// 1. Importe a nova Action
import { atualizarPipelineAction } from "@/actions/negociacoes/atualizar-pipeline.action";

export function usePipeline(colunasIniciais: KanbanColumnProps[]) {
  const [colunas, setColunas] = useState<KanbanColumnProps[]>(colunasIniciais);
  const [colunasAnteriores, setColunasAnteriores] = useState<KanbanColumnProps[]>(colunasIniciais);

  if (colunasIniciais !== colunasAnteriores) {
    setColunasAnteriores(colunasIniciais);
    setColunas([...colunasIniciais]); 
  }

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

    // Atualiza a tela instantaneamente (Interface Otimista)
    setColunas(novasColunas);

    toast.success(`Movido para ${colunaDestino.titulo}!`, {
      style: {
        borderRadius: '8px',
        background: '#333',
        color: '#fff',
      },
    });

    // 2. Chama a Action em background para persistir no db.json
    atualizarPipelineAction(novasColunas).then((resultado) => {
      if (!resultado.sucesso) {
        toast.error(resultado.mensagem || "Erro ao salvar a nova posição.");
      }
    });
  };

  return {
    colunas,
    onDragEnd
  };
}