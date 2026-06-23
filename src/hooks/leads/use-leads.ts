"use client";

import { useState } from "react";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";

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

  const agendarReuniao = (leadId: string | number, data: string, assunto: string) => {
    if (!data || !assunto) return;

    const novaReuniao: AtividadeReuniao = {
      id: crypto.randomUUID(), // Gera um ID único no navegador
      data,
      assunto,
    };

    // Atualiza o estado da tela instantaneamente
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId
          ? { ...lead, atividades: [...(lead.atividades || []), novaReuniao] }
          : lead
      )
    );

    // TODO: No futuro, chamaremos uma Server Action aqui para salvar no db.json
    // ex: await agendarReuniaoAction(leadId, novaReuniao);
  };

  return {
    leads,
    agendarReuniao,
  };
}