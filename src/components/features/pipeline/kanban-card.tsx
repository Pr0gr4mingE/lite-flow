"use client";

import { Draggable } from "@hello-pangea/dnd";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";

// Adicionamos o index estendido apenas para o DnD
interface DraggableCardProps extends KanbanCardProps {
  index: number;
}

export function KanbanCard({ id, titulo, subtitulo, corDestaque = 'cinza', index }: DraggableCardProps) {
  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-3 bg-white border border-gray-200 rounded-md shadow-sm border-l-4 border-l-${corDestaque}-500 ${
            snapshot.isDragging ? "shadow-lg rotate-2 scale-105" : ""
          }`}
        >
          <h4 className="font-semibold text-gray-900">{titulo}</h4>
          <p className="text-sm text-gray-500 mt-1">{subtitulo}</p>
        </div>
      )}
    </Draggable>
  );
}