"use client";

export interface TarefaUnificada {
  id: string;
  tipo: 'tarefa' | 'reuniao' | 'lembrete';
  descricao: string;
  data: string;
  cardId: string | number;
  cardTitulo: string;
  origem: string; // Ex: "Lead em Prospecção" ou "Cliente Fechado"
}

export function TarefasClient({ tarefas }: { tarefas: TarefaUnificada[] }) {
  if (tarefas.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
        <p className="text-gray-500">Você não possui nenhuma tarefa ou reunião agendada no momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tarefas.map((tarefa) => {
        // Define as cores com base no tipo
        const isReuniao = tarefa.tipo === 'reuniao';
        const corBadge = isReuniao ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
        
        return (
          <div key={tarefa.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${corBadge}`}>
                  {tarefa.tipo}
                </span>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                  {tarefa.origem}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">{tarefa.descricao}</h3>
              <p className="text-sm text-gray-500">Referente a: <span className="font-medium text-gray-700">{tarefa.cardTitulo}</span></p>
            </div>
            
            <div className="text-right whitespace-nowrap bg-gray-50 px-4 py-2 rounded-md border border-gray-100">
              <span className="text-sm text-gray-600 block">Data agendada</span>
              <span className="font-semibold text-gray-900">
                {new Date(tarefa.data).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}