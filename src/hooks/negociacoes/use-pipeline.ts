"use client";

import { useState } from "react";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { DropResult } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { atualizarPipelineAction } from "@/actions/negociacoes/atualizar-pipeline.action";

export function usePipeline(colunasIniciais: KanbanColumnProps[]) {
  const [colunas, setColunas] = useState<KanbanColumnProps[]>(colunasIniciais);
  const [colunasAnteriores, setColunasAnteriores] = useState<KanbanColumnProps[]>(colunasIniciais);

  if (colunasIniciais !== colunasAnteriores) {
    setColunasAnteriores(colunasIniciais);
    setColunas([...colunasIniciais]); 
  }

  // Transformamos a função em async para lidar melhor com a chamada ao servidor
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const novasColunas = [...colunas];
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

    // 2. Chama a Action otimizada enviando APENAS as coordenadas (Payload minúsculo e rápido)
    const resposta = await atualizarPipelineAction(
      cardMovido.id,           // Qual card moveu
      source.droppableId,      // De onde saiu
      destination.droppableId, // Para onde foi
      destination.index        // Em que posição ficou
    );

    // Se a Action retornar erro (ex: banco fora do ar), avisamos o usuário
    if (!resposta.sucesso) {
      toast.error(resposta.mensagem || "Erro ao salvar a nova posição no servidor.");
    }
  };

  return {
    colunas,
    onDragEnd
  };
}