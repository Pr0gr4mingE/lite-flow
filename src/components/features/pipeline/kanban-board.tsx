"use client";

import { DragDropContext } from "@hello-pangea/dnd";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanColumn } from "./kanban-column";
import { usePipeline } from "@/hooks/negociacoes/use-pipeline"; // 1. Importa o hook

interface BoardProps {
  colunasIniciais: KanbanColumnProps[]; // 2. Renomeamos a prop
}

export function KanbanBoard({ colunasIniciais }: BoardProps) {
  // 3. O hook agora controla o estado visual e nos entrega o onDragEnd
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