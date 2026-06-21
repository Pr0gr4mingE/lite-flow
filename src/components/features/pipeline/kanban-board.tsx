import { KanbanColumnProps } from '@/shared/types/ui/kanban-board.props';
import { KanbanColumn } from './kanban-column';

interface BoardProps {
  colunas: KanbanColumnProps[];
}

export function KanbanBoard({ colunas }: BoardProps) {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto items-start h-full scrollbar-thin scrollbar-thumb-gray-300">
      {colunas.map((coluna) => (
        <KanbanColumn 
          key={coluna.idDaColuna} 
          {...coluna} 
        />
      ))}
    </div>
  );
}