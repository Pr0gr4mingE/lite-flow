"use client";

import { useState } from "react";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";
import { atualizarStatusClienteAction, adicionarTarefaClienteAction } from "@/actions/crm.actions"; // <-- Importação das actions

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
  const atualizarStatus = async (clienteId: string | number, novoStatus: StatusNegociacao) => {
    // 1. Atualiza a tela instantaneamente
    setClientes((prev) =>
      prev.map((c) =>
        c.id === clienteId ? { ...c, statusNegociacao: novoStatus } : c
      )
    );

    // 2. Persiste a alteração no banco de dados
    await atualizarStatusClienteAction(clienteId, novoStatus);
  };

  // Adiciona uma atividade, mas bloqueia se o cliente for "indeferido" ou "pendente"
  const adicionarTarefa = async (clienteId: string | number, tipo: TipoTarefa, descricao: string, data: string) => {
    if (!descricao || !data) return;

    const novaTarefa: TarefaCliente = {
      id: crypto.randomUUID(),
      tipo,
      descricao,
      data,
    };

    // 1. Atualiza a tela instantaneamente
    setClientes((prev) =>
      prev.map((c) => {
        if (c.id === clienteId && c.statusNegociacao === 'fechada') {
          return { ...c, tarefas: [...(c.tarefas || []), novaTarefa] };
        }
        return c; // Se não for fechada, retorna o cliente intacto (bloqueio de segurança)
      })
    );

    // Verifica a regra de negócio localmente antes de enviar para o banco de dados
    const clienteAlvo = clientes.find((c) => c.id === clienteId);
    if (clienteAlvo?.statusNegociacao === 'fechada') {
      // 2. Persiste a nova tarefa no banco de dados
      await adicionarTarefaClienteAction(clienteId, novaTarefa);
    }
  };

  return {
    clientes,
    atualizarStatus,
    adicionarTarefa,
  };
}