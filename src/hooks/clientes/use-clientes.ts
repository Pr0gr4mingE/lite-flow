"use client";

import { useState } from "react";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";

export type StatusNegociacao = 'pendente' | 'fechada' | 'indeferida';
export type TipoTarefa = 'tarefa' | 'reuniao' | 'lembrete';

export interface TarefaCliente {
  id: string;
  tipo: TipoTarefa;
  descricao: string;
  data: string;
}

export interface ClienteProps extends KanbanCardProps {
  statusNegociacao: StatusNegociacao;
  tarefas?: TarefaCliente[];
}

export function useClientes(clientesIniciais: ClienteProps[]) {
  const [clientes, setClientes] = useState<ClienteProps[]>(clientesIniciais);

  // Altera o status após a reunião
  const atualizarStatus = (clienteId: string | number, novoStatus: StatusNegociacao) => {
    setClientes((prev) =>
      prev.map((c) =>
        c.id === clienteId ? { ...c, statusNegociacao: novoStatus } : c
      )
    );
  };

  // Adiciona uma atividade, mas bloqueia se o cliente for "indeferido" ou "pendente"
  const adicionarTarefa = (clienteId: string | number, tipo: TipoTarefa, descricao: string, data: string) => {
    if (!descricao || !data) return;

    setClientes((prev) =>
      prev.map((c) => {
        if (c.id === clienteId && c.statusNegociacao === 'fechada') {
          const novaTarefa: TarefaCliente = {
            id: crypto.randomUUID(),
            tipo,
            descricao,
            data,
          };
          return { ...c, tarefas: [...(c.tarefas || []), novaTarefa] };
        }
        return c; // Se não for fechada, retorna o cliente intacto (bloqueio de segurança)
      })
    );
  };

  return {
    clientes,
    atualizarStatus,
    adicionarTarefa,
  };
}