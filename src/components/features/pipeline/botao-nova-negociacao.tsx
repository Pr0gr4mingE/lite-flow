"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { FormNovaNegociacao, DadosNovaNegociacao } from "./form-nova-negociacao"; // 1. Importamos a interface

export function BotaoNovaNegociacao() {
  const [modalAberto, setModalAberto] = useState(false);

  // 2. Substituímos o 'any' pela tipagem correta
  const handleSalvar = (dados: DadosNovaNegociacao) => {
    console.log("Dados prontos para enviar pro servidor:", dados);
    // Aqui vai entrar a chamada para a Server Action em breve!
    
    setModalAberto(false); 
  };

  return (
    <>
      <button
        onClick={() => setModalAberto(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm flex items-center gap-2"
      >
        <span className="text-xl leading-none">+</span> Nova Negociação
      </button>

      <Modal 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
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