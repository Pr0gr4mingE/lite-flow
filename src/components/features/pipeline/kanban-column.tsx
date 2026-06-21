import { KanbanColumnProps } from '@/shared/types/ui/kanban-board.props';
import { KanbanCard } from './kanban-card';

export function KanbanColumn({ idDaColuna, titulo, corDoCabecalho, cards }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-80 bg-gray-50/50 border border-gray-200 rounded-lg shrink-0">
      {/* Cabeçalho da Coluna */}
      <div className={`p-3 rounded-t-lg border-b border-gray-200 ${corDoCabecalho}`}>
        <h3 className="font-bold text-gray-700 flex items-center justify-between">
          {titulo}
          <span className="text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
            {cards.length}
          </span>
        </h3>
      </div>

      {/* Área Dropável (onde os cards ficam) */}
      <div className="p-3 flex-1 overflow-y-auto min-h-[500px]">
        {cards.map((card) => (
          <KanbanCard 
            key={card.id} 
            {...card} 
          />
        ))}
        
        {cards.length === 0 && (
          <div className="text-center p-4 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-md">
            Nenhuma negociação
          </div>
        )}
      </div>
    </div>
  );
}