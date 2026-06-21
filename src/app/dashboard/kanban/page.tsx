import { KanbanBoard } from '@/components/features/pipeline/kanban-board';
import { KanbanColumnProps } from '@/shared/types/ui/kanban-board.props';

export default function KanbanPage() {
  // Dados simulados (Mock) para testar a UI antes de conectar o banco de dados
  const colunasMock: KanbanColumnProps[] = [
    {
      idDaColuna: 'col-1',
      titulo: 'Prospecção',
      corDoCabecalho: 'bg-blue-50',
      cards: [
        {
          id: 1,
          titulo: 'Implantação de ERP',
          subtitulo: 'TechCorp Indústria',
          valorFormatado: 'R$ 15.000,00',
          corDestaque: 'azul',
        },
        {
          id: 2,
          titulo: 'Consultoria de Redes',
          subtitulo: 'Clínica Vida',
          valorFormatado: 'R$ 3.500,00',
          corDestaque: 'cinza',
        },
      ],
    },
    {
      idDaColuna: 'col-2',
      titulo: 'Proposta',
      corDoCabecalho: 'bg-yellow-50',
      cards: [
        {
          id: 3,
          titulo: 'Licenciamento 50 Maquinas',
          subtitulo: 'Escola do Futuro',
          valorFormatado: 'R$ 8.200,00',
          corDestaque: 'azul',
        },
      ],
    },
    {
      idDaColuna: 'col-3',
      titulo: 'Fechamento',
      corDoCabecalho: 'bg-green-50',
      cards: [
        {
          id: 4,
          titulo: 'Servidor em Nuvem Mensal',
          subtitulo: 'Agência Criativa',
          valorFormatado: 'R$ 1.200,00',
          corDestaque: 'verde',
        },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quadro Kanban</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie o fluxo das suas negociações arrastando os cards.
        </p>
      </div>

      {/* Container flex-1 para que o board ocupe o restante da tela disponível */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <KanbanBoard colunas={colunasMock} />
      </div>
    </div>
  );
}