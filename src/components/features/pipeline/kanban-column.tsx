"use client";

import { Droppable } from "@hello-pangea/dnd";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanCard } from "./kanban-card";

export function KanbanColumn({ idDaColuna, titulo, corDoCabecalho, cards }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-80 bg-gray-50/50 border border-gray-200 rounded-lg shrink-0">
      <div className={`p-3 rounded-t-lg border-b border-gray-200 ${corDoCabecalho}`}>
        <h3 className="font-bold text-gray-700">{titulo} ({cards.length})</h3>
      </div>

      <Droppable droppableId={idDaColuna}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`p-3 flex-1 min-h-[500px] transition-colors ${
              snapshot.isDraggingOver ? "bg-blue-50/50" : ""
            }`}
          >
            {cards.map((card, index) => (
              <KanbanCard key={card.id} {...card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}