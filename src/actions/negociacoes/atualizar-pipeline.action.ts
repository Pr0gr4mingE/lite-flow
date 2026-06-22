"use server";

import { jsonDb } from "@/infrastructure/database/json-client";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props"; // Ajuste para kanban-column.props se necessário
import { revalidatePath } from "next/cache";

export async function atualizarPipelineAction(novasColunas: KanbanColumnProps[]) {
  try {
    const banco = await jsonDb.ler();
    
    // Substitui inteiramente as colunas velhas pelas novas (com as novas posições dos cards)
    // Mantemos intactos os leads e clientes do db.json
    banco.colunas = novasColunas;

    // Salva a alteração no db.json
    await jsonDb.salvar(banco);

    // Silenciosamente revalida o cache do Next.js
    revalidatePath("/dashboard/kanban");

    return { sucesso: true };

  } catch (erro) {
    console.error("Erro ao atualizar pipeline:", erro);
    return { sucesso: false, mensagem: "Falha ao sincronizar o movimento no servidor." };
  }
}