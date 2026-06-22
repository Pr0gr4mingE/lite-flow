"use server";

import { EtapaFunil } from "@/shared/types/domain/negociacao.type";
// No futuro, importaremos o Use Case: 
// import { moverKanbanUseCase } from "@/modules/negociacoes/usecases/mover-kanban.usecase";

export async function moverNegociacaoAction(negociacaoId: number, novaEtapa: EtapaFunil) {
  try {
    // 1. Validação de segurança básica (ex: usuário está logado?)
    // ...

    // 2. Chama a regra de negócio do Domínio (O "Coração")
    // const resultado = await moverKanbanUseCase.executar({ negociacaoId, novaEtapa });
    
    // Simulação do tempo de resposta do banco de dados (Mock)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`[Servidor] Negociação ${negociacaoId} movida para ${novaEtapa}`);

    // 3. Retorna o sucesso para a interface
    return { sucesso: true, mensagem: "Negociação movida com sucesso!" };

  } catch (erro) {
    console.error("Erro ao mover negociação:", erro);
    return { sucesso: false, mensagem: "Falha ao mover a negociação." };
  }
}