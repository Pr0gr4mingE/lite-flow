"use client";

import { useState } from "react";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { DropResult } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { moverCardAction } from "@/actions/crm.actions"; // <-- Trocado para a nossa Action multi-tenant

export function usePipeline(colunasIniciais: KanbanColumnProps[]) {
  const [colunas, setColunas] = useState<KanbanColumnProps[]>(colunasIniciais);
  const [colunasAnteriores, setColunasAnteriores] = useState<KanbanColumnProps[]>(colunasIniciais);

  if (colunasIniciais !== colunasAnteriores) {
    setColunasAnteriores(colunasIniciais);
    setColunas([...colunasIniciais]); 
  }

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Criamos cópias seguras para evitar mutação direta (boas práticas do React)
    const novasColunas = colunas.map(col => ({
      ...col,
      cards: [...col.cards]
    }));

    const colunaOrigem = novasColunas.find(col => col.idDaColuna === source.droppableId);
    const colunaDestino = novasColunas.find(col => col.idDaColuna === destination.droppableId);

    if (!colunaOrigem || !colunaDestino) return;

    // Retira o card da origem e o injeta no destino
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

    // 1. Mapeia a nova ordem visual gerando um array apenas com os IDs
   const novaOrdemIds = colunaDestino.cards.map((card) => String(card.id));

    // 2. Chama a Action enviando os dados exatos que preparamos no back-end
    const resposta = await moverCardAction(
      draggableId,
      source.droppableId,
      destination.droppableId,
      novaOrdemIds // Passando a lista de IDs para o servidor ordenar corretamente
    );

    // Se a Action retornar erro avisamos o usuário
    if (!resposta.sucesso) {
      toast.error(resposta.erro || "Erro ao salvar a nova posição no servidor.");
      // Se quisesse ser ainda mais rigoroso, poderia dar um setColunas(colunasAnteriores) aqui para reverter o visual
    }
  };

  return {
    colunas,
    onDragEnd
  };
}