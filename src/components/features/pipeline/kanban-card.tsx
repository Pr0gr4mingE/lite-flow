"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";
// Importando as actions que criamos
import { editarCardAction, excluirCardAction } from "@/actions/crm.actions"; 

interface DraggableCardProps extends KanbanCardProps {
  index: number;
}

export function KanbanCard({ id, titulo, subtitulo = "", valorFormatado = "", corDestaque = 'cinza', index }: DraggableCardProps) {
  // 1. Estados para controlar a interface de edição
  const [estaEditando, setEstaEditando] = useState(false);
  const [estaCarregando, setEstaCarregando] = useState(false);
  
  // Estados para os 3 campos
  const [tituloEditado, setTituloEditado] = useState(titulo);
  const [subtituloEditado, setSubtituloEditado] = useState(subtitulo);
  const [valorEditado, setValorEditado] = useState(valorFormatado);

  // 2. Funções de ação
  const handleExcluir = async () => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este card?");
    if (!confirmacao) return;

    setEstaCarregando(true);
    await excluirCardAction(id.toString());
  };

  const handleSalvarEdicao = async () => {
    // Validação mínima para não salvar card sem título
    if (tituloEditado.trim() === "") {
      setEstaEditando(false);
      setTituloEditado(titulo); // Volta ao normal se tentou salvar vazio
      return;
    }

    setEstaCarregando(true);
    
    // Manda todos os dados que temos para a action
    await editarCardAction(id.toString(), { 
      titulo: tituloEditado,
      empresa: subtituloEditado, // Supondo que sua action salva o subtítulo como empresa no banco
      valorFormatado: valorEditado 
    });
    
    setEstaEditando(false);
    setEstaCarregando(false);
  };

  // Função auxiliar para resetar os campos caso o usuário cancele
  const cancelarEdicao = () => {
    setEstaEditando(false);
    setTituloEditado(titulo);
    setSubtituloEditado(subtitulo);
    setValorEditado(valorFormatado);
  };

  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // A classe 'group' aqui é o segredo para os ícones aparecerem no hover
          className={`relative p-4 mb-3 bg-white border border-gray-200 rounded-md shadow-sm border-l-4 border-l-${corDestaque}-500 group transition-all duration-200 ${
            snapshot.isDragging ? "shadow-lg rotate-2 scale-105 z-50" : "hover:border-gray-300"
          }`}
        >
          {/* Overlay de carregamento enquanto salva no banco */}
          {estaCarregando && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
              <span className="text-xs text-gray-600 font-medium animate-pulse">Atualizando...</span>
            </div>
          )}

          <div className="flex justify-between items-start gap-2">
            
            {estaEditando ? (
              // ==========================================
              // MODO EDIÇÃO: Múltiplos Inputs Empilhados
              // ==========================================
              <div className="flex-1 flex flex-col gap-2 w-full pr-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Título do negócio"
                  className="w-full px-2 py-1 text-sm font-semibold text-gray-900 border border-blue-400 rounded outline-none focus:ring-1 focus:ring-blue-500"
                  value={tituloEditado}
                  onChange={(e) => setTituloEditado(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Nome do Cliente/Empresa"
                  className="w-full px-2 py-1 text-xs text-gray-700 border border-blue-400 rounded outline-none focus:ring-1 focus:ring-blue-500"
                  value={subtituloEditado}
                  onChange={(e) => setSubtituloEditado(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Valor (Ex: R$ 5.000,00)"
                  className="w-full px-2 py-1 text-xs text-green-700 border border-blue-400 rounded outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  value={valorEditado}
                  onChange={(e) => setValorEditado(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSalvarEdicao();
                    if (e.key === "Escape") cancelarEdicao();
                  }}
                />
                <div className="flex justify-end gap-1 mt-1">
                  <button 
                    onClick={cancelarEdicao}
                    className="text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSalvarEdicao}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              // ==========================================
              // MODO VISUALIZAÇÃO: Título Normal
              // ==========================================
              <h4 className="font-semibold text-gray-900 pr-2 truncate">{titulo}</h4>
            )}
            
            {/* Ícones minimalistas - Ficam escondidos (opacity-0) até o hover (group-hover:opacity-100) */}
            {!estaEditando && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                
                {/* Lápis de Editar */}
                <button 
                  onClick={() => setEstaEditando(true)}
                  className="text-gray-400 hover:text-blue-500 p-1 rounded transition-colors"
                  title="Editar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                  </svg>
                </button>
                
                {/* Lixeira de Excluir */}
                <button 
                  onClick={handleExcluir}
                  className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                  title="Excluir"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
                
              </div>
            )}
          </div>
          
          {/* Exibe o subtitulo e o valor apenas no modo normal */}
          {!estaEditando && (
            <>
              {subtitulo && <p className="text-sm text-gray-500 mt-1">{subtitulo}</p>}
              {valorFormatado && <p className="text-sm text-green-600 font-medium mt-1">{valorFormatado}</p>}
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}