"use client";

import { useState } from "react";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";
import { agendarReuniaoAction } from "@/actions/crm.actions"; // <-- Importação da action

// Expandimos o tipo do card para suportar atividades
export interface AtividadeReuniao {
  id: string;
  data: string;
  assunto: string;
}

export interface LeadProps extends KanbanCardProps {
  atividades?: AtividadeReuniao[];
}

export function useLeads(leadsIniciais: LeadProps[]) {
  const [leads, setLeads] = useState<LeadProps[]>(leadsIniciais);

  // A função agora é async para poder aguardar a resposta do servidor
  const agendarReuniao = async (leadId: string | number, data: string, assunto: string) => {
    if (!data || !assunto) return;

    const novaReuniao: AtividadeReuniao = {
      id: crypto.randomUUID(), // Gera um ID único no navegador
      data,
      assunto,
    };

    // 1. Atualiza o estado da tela instantaneamente (Atualização Otimista)
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId
          ? { ...lead, atividades: [...(lead.atividades || []), novaReuniao] }
          : lead
      )
    );

    // 2. Persiste os dados chamando a Server Action em segundo plano
    await agendarReuniaoAction(leadId, novaReuniao);
  };

  return {
    leads,
    agendarReuniao,
  };
}