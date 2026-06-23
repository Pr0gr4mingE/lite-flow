"use client";

import { useLeads, LeadProps } from "@/hooks/leads/use-leads";
import { useState } from "react";

export function LeadsClient({ leadsIniciais }: { leadsIniciais: LeadProps[] }) {
  const { leads, agendarReuniao } = useLeads(leadsIniciais);
  
  // Estado para controlar o input do mini-form de agendamento
  const [leadAtivo, setLeadAtivo] = useState<string | number | null>(null);
  const [dataReuniao, setDataReuniao] = useState("");
  const [assuntoReuniao, setAssuntoReuniao] = useState("");

  const handleAgendar = (leadId: string | number) => {
    agendarReuniao(leadId, dataReuniao, assuntoReuniao);
    setLeadAtivo(null); // Fecha o form
    setDataReuniao("");
    setAssuntoReuniao("");
  };

  if (leads.length === 0) {
    return <p className="text-gray-500">Nenhum lead na fase de prospecção no momento.</p>;
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Info do Lead */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{lead.titulo}</h3>
            <p className="text-sm text-gray-500">{lead.subtitulo} • {lead.valorFormatado}</p>
          </div>

          {/* Área de Atividades (Reuniões) */}
          <div className="flex-1 bg-gray-50 p-3 rounded-md w-full md:w-auto border border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Reuniões Agendadas</h4>
            
            {lead.atividades && lead.atividades.length > 0 ? (
              <ul className="space-y-1 mb-3 text-sm">
                {lead.atividades.map(ativ => (
                  <li key={ativ.id} className="flex justify-between border-b border-gray-200 pb-1 last:border-0">
                    <span className="text-gray-700">{ativ.assunto}</span>
                    <span className="text-gray-500 font-medium">{new Date(ativ.data).toLocaleDateString('pt-BR')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 mb-3 italic">Nenhuma reunião marcada.</p>
            )}

            {/* Controle do Botão / Formulário */}
            {leadAtivo === lead.id ? (
              <div className="flex gap-2">
                <label
                  htmlFor="dataReuniao"
                  className="text-sm font-medium text-gray-700"
                >
                  Data:
                </label>
                <input 
                  id="dataReuniao"
                  type="date" 
                  className="text-sm border rounded px-2 py-1 w-full"
                  value={dataReuniao}
                  onChange={(e) => setDataReuniao(e.target.value)}
                />
                <label
                  htmlFor="assuntoReuniao"
                  className="text-sm font-medium text-gray-700"
                >
                  Assunto:
                </label>
                <input 
                  id="assuntoReuniao"
                  type="text" 
                  placeholder="Assunto"
                  className="text-sm border rounded px-2 py-1 w-full"
                  value={assuntoReuniao}
                  onChange={(e) => setAssuntoReuniao(e.target.value)}
                />
                <button 
                  onClick={() => handleAgendar(lead.id)}
                  className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setLeadAtivo(lead.id)}
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                + Agendar Reunião
              </button>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}