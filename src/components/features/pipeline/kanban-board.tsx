"use client";

import { DragDropContext } from "@hello-pangea/dnd";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanColumn } from "./kanban-column";
import { usePipeline } from "@/hooks/negociacoes/use-pipeline"; 

interface BoardProps {
  colunasIniciais: KanbanColumnProps[]; 
}

export function KanbanBoard({ colunasIniciais }: BoardProps) {
  // O hook assume toda a responsabilidade visual e de persistência de dados
  const { colunas, onDragEnd } = usePipeline(colunasIniciais);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4 overflow-x-auto items-start h-full scrollbar-thin scrollbar-thumb-gray-300">
        {colunas.map((coluna) => (
          <KanbanColumn key={coluna.idDaColuna} {...coluna} />
        ))}
      </div>
    </DragDropContext>
  );
}