"use server";

import { jsonDb } from "@/infrastructure/database/json-client";
import { DadosNovaNegociacao } from "@/components/features/pipeline/form-nova-negociacao";
import { revalidatePath } from "next/cache";

// Importações baseadas na sua estrutura de pastas
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props"; 
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";

export async function criarNegociacaoAction(dados: DadosNovaNegociacao) {
  try {
    const banco = await jsonDb.ler();
    
    // Encontra a coluna de Prospecção
    const colunaProspeccao = banco.colunas.find((c: KanbanColumnProps) => c.idDaColuna === "col-1");

    if (!colunaProspeccao) {
      throw new Error("Coluna de origem não encontrada.");
    }

    // Monta o novo card perfeitamente tipado
    const novoCard: KanbanCardProps = {
      id: Date.now(), 
      titulo: dados.titulo,
      subtitulo: dados.empresa,
      valorFormatado: dados.valorFormatado,
      corDestaque: "azul" 
    };

    // Adiciona o card no início do array da coluna
    colunaProspeccao.cards.unshift(novoCard);

    // Salva o JSON atualizado
    await jsonDb.salvar(banco);

    // Força o Next.js a recarregar a página do Kanban para mostrar o novo card
    revalidatePath("/dashboard/kanban");

    return { sucesso: true, mensagem: "Negociação criada com sucesso!" };

  } catch (erro) {
    console.error("Erro ao criar negociação:", erro);
    return { sucesso: false, mensagem: "Falha ao salvar no servidor." };
  }
}