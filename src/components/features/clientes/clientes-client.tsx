"use client";

import { useState } from "react";
import { useClientes, ClienteProps, TipoTarefa } from "@/hooks/clientes/use-clientes";

export function ClientesClient({ clientesIniciais }: { clientesIniciais: ClienteProps[] }) {
  const { clientes, atualizarStatus, adicionarTarefa } = useClientes(clientesIniciais);

  // Estados do formulário de tarefas
  const [clienteAtivo, setClienteAtivo] = useState<string | number | null>(null);
  const [tipoTarefa, setTipoTarefa] = useState<TipoTarefa>('tarefa');
  const [descricao, setDescricao] = useState("");
  const [dataTarefa, setDataTarefa] = useState("");

  const handleSalvarTarefa = (clienteId: string | number) => {
    adicionarTarefa(clienteId, tipoTarefa, descricao, dataTarefa);
    setClienteAtivo(null);
    setDescricao("");
    setDataTarefa("");
  };

  if (clientes.length === 0) {
    return <p className="text-gray-500">Nenhum cliente no histórico ainda.</p>;
  }

  return (
    <div className="space-y-6">
      {clientes.map((cliente) => (
        <div 
          key={cliente.id} 
          className={`p-5 rounded-lg border shadow-sm transition-all ${
            cliente.statusNegociacao === 'indeferida' 
              ? 'bg-gray-50 border-gray-200 opacity-75' // Estilo de Histórico Inativo
              : 'bg-white border-blue-100' // Estilo de Cliente Ativo
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            
            {/* Informações do Cliente */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`font-semibold text-lg ${cliente.statusNegociacao === 'indeferida' ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                  {cliente.titulo}
                </h3>
                
                {/* Badges de Status */}
                {cliente.statusNegociacao === 'pendente' && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pós-Reunião</span>}
                {cliente.statusNegociacao === 'fechada' && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Negócio Fechado</span>}
                {cliente.statusNegociacao === 'indeferida' && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Indeferida</span>}
              </div>
              <p className="text-sm text-gray-500">{cliente.subtitulo} • {cliente.valorFormatado}</p>

              {/* Botões de Ação (Apenas se estiver pendente) */}
              {cliente.statusNegociacao === 'pendente' && (
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => atualizarStatus(cliente.id, 'fechada')}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
                  >
                    Marcar como Fechada (Venceu)
                  </button>
                  <button 
                    onClick={() => atualizarStatus(cliente.id, 'indeferida')}
                    className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded hover:bg-red-200"
                  >
                    Marcar como Indeferida (Perdeu)
                  </button>
                </div>
              )}
            </div>

            {/* Painel de Tarefas (Exclusivo para Negociações Fechadas) */}
            {cliente.statusNegociacao === 'fechada' && (
              <div className="flex-1 bg-blue-50 p-4 rounded-md w-full md:w-auto border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-900 mb-3">Painel de Tarefas</h4>
                
                {/* Lista de Tarefas */}
                {cliente.tarefas && cliente.tarefas.length > 0 ? (
                  <ul className="space-y-2 mb-4">
                    {cliente.tarefas.map(tarefa => (
                      <li key={tarefa.id} className="text-sm flex items-center justify-between bg-white p-2 rounded border border-blue-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase text-blue-500">[{tarefa.tipo}]</span>
                          <span className="text-gray-700">{tarefa.descricao}</span>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(tarefa.data).toLocaleDateString('pt-BR')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-blue-400 mb-3 italic">Nenhuma tarefa diária registrada.</p>
                )}

                {/* Formulário de Nova Tarefa */}
                {clienteAtivo === cliente.id ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex gap-2 items-center">
                        {/* Select com a propriedade name adicionada */}
                        <select 
                            name="tipoTarefa"
                            className="text-sm border border-blue-200 rounded px-2 py-1 bg-white"
                            value={tipoTarefa}
                            onChange={(e) => setTipoTarefa(e.target.value as TipoTarefa)}
                        >
                            <option value="tarefa">Tarefa Diária</option>
                            <option value="reuniao">Reunião</option>
                            <option value="lembrete">Lembrete</option>
                        </select>

                        {/* Label envolvendo o input de data para acessibilidade e semântica */}
                        <label className="flex items-center gap-2 text-sm text-blue-900 font-medium">
                            Data:
                            <input 
                            type="date" 
                            name="dataTarefa"
                            className="text-sm border border-blue-200 rounded px-2 py-1 bg-white font-normal"
                            value={dataTarefa}
                            onChange={(e) => setDataTarefa(e.target.value)}
                            />
                        </label>
                        </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Descrição da atividade..."
                        className="text-sm border border-blue-200 rounded px-2 py-1 w-full bg-white"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                      />
                      <button 
                        onClick={() => handleSalvarTarefa(cliente.id)}
                        className="bg-blue-600 text-white text-xs px-4 py-1 rounded hover:bg-blue-700 font-medium"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setClienteAtivo(cliente.id)}
                    className="text-xs text-blue-700 font-semibold hover:underline"
                  >
                    + Adicionar Atividade
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}