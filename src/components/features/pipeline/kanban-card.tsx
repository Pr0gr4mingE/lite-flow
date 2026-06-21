import { KanbanCardProps } from '@/shared/types/ui/kanban-card.props';
import { Badge } from '@/components/ui/badge';

export function KanbanCard({
  titulo,
  subtitulo,
  valorFormatado,
  corDestaque = 'cinza',
  aoClicar,
}: KanbanCardProps) {
  
  const bordaEsquerda = {
    azul: 'border-l-blue-500',
    verde: 'border-l-green-500',
    cinza: 'border-l-gray-300',
  };

  return (
    <div
      onClick={aoClicar}
      className={`p-4 mb-3 bg-white border border-gray-200 rounded-md shadow-sm border-l-4 ${bordaEsquerda[corDestaque]} hover:shadow-md hover:border-gray-300 cursor-pointer transition-all duration-200`}
    >
      <h4 className="font-semibold text-gray-900 truncate">{titulo}</h4>
      
      {subtitulo && (
        <p className="text-sm text-gray-500 mt-1 truncate">{subtitulo}</p>
      )}
      
      {valorFormatado && (
        <div className="mt-3">
          <Badge texto={valorFormatado} variante="neutro" />
        </div>
      )}
    </div>
  );
}