"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { FormNovaNegociacao, DadosNovaNegociacao } from "./form-nova-negociacao";
import { criarNegociacaoAction } from "@/actions/negociacoes/criar-negociacao.action";
import toast from "react-hot-toast";

export function BotaoNovaNegociacao() {
  const [modalAberto, setModalAberto] = useState(false);
  const [estaSalvando, setEstaSalvando] = useState(false);

  const handleSalvar = async (dados: DadosNovaNegociacao) => {
    setEstaSalvando(true);
    
    const resposta = await criarNegociacaoAction(dados);

    if (resposta.sucesso) {
      toast.success(resposta.mensagem);
      setModalAberto(false);
    } else {
      toast.error(resposta.mensagem);
    }

    setEstaSalvando(false);
  };

  return (
    <>
      <button
        onClick={() => setModalAberto(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm flex items-center gap-2"
        disabled={estaSalvando}
      >
        <span className="text-xl leading-none">+</span> Nova Negociação
      </button>

      <Modal 
        isOpen={modalAberto} 
        onClose={() => !estaSalvando && setModalAberto(false)} 
        titulo="Criar Nova Negociação"
      >
        <FormNovaNegociacao 
          onSalvar={handleSalvar} 
          onCancelar={() => setModalAberto(false)} 
        />
      </Modal>
    </>
  );
}