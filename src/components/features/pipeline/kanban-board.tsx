"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd"; // 1. Importação adicionada
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanColumn } from "./kanban-column";

interface BoardProps {
  colunas: KanbanColumnProps[];
  onDragEnd: (result: DropResult) => void; // 2. Substituímos o 'any' pelo tipo correto
}

export function KanbanBoard({ colunas, onDragEnd }: BoardProps) {
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