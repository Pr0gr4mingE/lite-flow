"use server";

import { jsonDb } from "@/infrastructure/database/json-client";
import { DadosNovaNegociacao } from "@/components/features/pipeline/form-nova-negociacao";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"; // <-- Importamos os cookies

// Importações baseadas na sua estrutura de pastas
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props"; 
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";


// 1. Tipagem rápida pro TS entender o novo formato do banco
interface QuadroProps {
  id: string;
  membrosIds: string[];
  colunas: KanbanColumnProps[];
}

interface BancoDeDadosProps {
  quadros: QuadroProps[];
}

export async function criarNegociacaoAction(dados: DadosNovaNegociacao) {
  try {
    // 2. Verifica quem está logado
    const cookieStore = await cookies();
    const userId = cookieStore.get("crm_session")?.value;

    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    // 3. Lê o banco com o Double Cast
    const banco = (await jsonDb.ler()) as unknown as BancoDeDadosProps;
    
    // 4. Isola o quadro do usuário
    const quadros = banco.quadros || [];
    const quadroDoUsuario = quadros.find((q: QuadroProps) => q.membrosIds.includes(userId));

    if (!quadroDoUsuario) {
      throw new Error("Quadro não encontrado para este usuário.");
    }

    // 5. Encontra a coluna de Prospecção APENAS no quadro desse usuário
    const colunaProspeccao = quadroDoUsuario.colunas.find(
      (c: KanbanColumnProps) => c.idDaColuna === "col-1" || c.titulo.toLowerCase().includes("prospecção")
    );

    if (!colunaProspeccao) {
      throw new Error("Coluna de origem não encontrada neste quadro.");
    }

    // Monta o novo card perfeitamente tipado
    const novoCard: KanbanCardProps = {
      id: String(Date.now()), // <-- Convertido para String pra evitar conflitos no Drag&Drop!
      titulo: dados.titulo,
      subtitulo: dados.empresa,
      valorFormatado: dados.valorFormatado,
      corDestaque: "azul",
    };

    // Adiciona o card no início do array da coluna
    colunaProspeccao.cards.unshift(novoCard);

    // Salva o JSON atualizado
    await jsonDb.salvar(banco as unknown as Parameters<typeof jsonDb.salvar>[0]);

    // Força o Next.js a recarregar a página do Kanban
    revalidatePath("/dashboard/kanban");

    return { sucesso: true, mensagem: "Negociação criada com sucesso!" };

  } catch (erro: unknown) {
    console.error("Erro ao criar negociação:", erro);
    
    // Como o erro é 'unknown', testamos se ele é uma instância de Error antes de ler o erro.message
    const mensagemErro = erro instanceof Error ? erro.message : "Falha ao salvar no servidor.";
    
    return { sucesso: false, mensagem: mensagemErro };
  }
}