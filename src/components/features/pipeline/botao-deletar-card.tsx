"use client";

import { deletarNegociacaoAction } from "@/actions/negociacoes/deletar-negociacao.action";
import toast from "react-hot-toast";

interface BotaoDeletarCardProps {
  cardId: number | string;
}

export function BotaoDeletarCard({ cardId }: BotaoDeletarCardProps) {
  
  // O handler que parecia não estar sendo usado:
  const handleDeletar = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta negociação?")) return;

    const resposta = await deletarNegociacaoAction(cardId);

    if (resposta.sucesso) {
      toast.success("Negociação excluída com sucesso!", {
        style: { borderRadius: '8px', background: '#333', color: '#fff' }
      });
    } else {
      toast.error(resposta.mensagem || "Erro ao excluir negociação.");
    }
  };

  return (
    <button 
      onClick={handleDeletar} // <-- O VÍNCULO ESSENCIAL ENTRA AQUI!
      className="text-gray-400 hover:text-red-500 transition-colors p-1"
      title="Excluir card"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      </svg>
    </button>
  );
}