"use server";

import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const caminhoCrm = path.join(process.cwd(), "src", "infrastructure", "database", "db.json");

// ==========================================
// 1. TIPAGENS (Resolvendo o problema do 'any')
// ==========================================
// Adicione a tipagem do usuário
export interface UsuarioProps {
  id: string;
  nome: string;
  email: string;
  senha?: string;
}

// Atualize a interface do BancoDeDadosProps
export interface BancoDeDadosProps {
  usuarios?: UsuarioProps[]; // <-- Linha adicionada para o Auth!
  quadros: QuadroProps[];
}

export interface TarefaClienteProps {
  id: string;
  tipo: string;
  descricao: string;
  data: string;
}

export interface CardProps {
  id: string;
  titulo: string;
  empresa?: string;
  valorFormatado?: string;
  statusNegociacao?: string;
  tarefas?: TarefaClienteProps[];
  atividades?: unknown[];
}

export interface ColunaProps {
  idDaColuna: string;
  titulo: string;
  cards: CardProps[];
}

export interface QuadroProps {
  id: string;
  titulo: string;
  donoId: string;
  membrosIds: string[];
  colunas: ColunaProps[];
}

export interface BancoDeDadosProps {
  usuarios?: UsuarioProps[]; // <-- Linha adicionada para o Auth!
  quadros: QuadroProps[];
}

// ==========================================
// 2. FUNÇÕES AUXILIARES TIPADAS
// ==========================================

// Função auxiliar para ler o banco e extrair o quadro do utilizador logado
async function obterBancoEQuadro(): Promise<{ banco: BancoDeDadosProps; quadro: QuadroProps }> {
  const conteudo = await fs.readFile(caminhoCrm, "utf-8");
  const banco = JSON.parse(conteudo) as BancoDeDadosProps;
  
  const cookieStore = await cookies();
  const userId = cookieStore.get("crm_session")?.value;

  if (!userId) throw new Error("Utilizador não autenticado.");

  const quadro = banco.quadros?.find((q: QuadroProps) => q.membrosIds.includes(userId));
  if (!quadro) throw new Error("Quadro não encontrado para este utilizador.");

  return { banco, quadro };
}

// Salva as alterações de volta no arquivo
async function salvarBanco(banco: BancoDeDadosProps) {
  await fs.writeFile(caminhoCrm, JSON.stringify(banco, null, 2), "utf-8");
}

// ==========================================
// 3. SERVER ACTIONS
// ==========================================

// Atualiza o status de pós-venda do cliente
export async function atualizarStatusClienteAction(clienteId: string | number, novoStatus: string) {
  try {
    const { banco, quadro } = await obterBancoEQuadro();

    quadro.colunas.forEach((coluna: ColunaProps) => {
      coluna.cards.forEach((card: CardProps) => {
        if (card.id === String(clienteId)) {
          card.statusNegociacao = novoStatus;
        }
      });
    });

    await salvarBanco(banco);
    revalidatePath("/clientes");
    return { sucesso: true };
  } catch (error: unknown) {
    if (error instanceof Error) return { sucesso: false, erro: error.message };
    return { sucesso: false, erro: "Ocorreu um erro desconhecido." };
  }
}

// Adiciona uma tarefa/lembrete a um cliente fechado
export async function adicionarTarefaClienteAction(clienteId: string | number, novaTarefa: TarefaClienteProps) {
  try {
    const { banco, quadro } = await obterBancoEQuadro();

    quadro.colunas.forEach((coluna: ColunaProps) => {
      coluna.cards.forEach((card: CardProps) => {
        if (card.id === String(clienteId)) {
          if (!card.tarefas) card.tarefas = [];
          card.tarefas.push(novaTarefa);
        }
      });
    });

    await salvarBanco(banco);
    revalidatePath("/clientes");
    revalidatePath("/tarefas");
    return { sucesso: true };
  } catch (error: unknown) {
    if (error instanceof Error) return { sucesso: false, erro: error.message };
    return { sucesso: false, erro: "Ocorreu um erro desconhecido." };
  }
}

// PERSISTÊNCIA DO DRAG AND DROP: Move um card entre colunas ou posições
export async function moverCardAction(
  cardId: string,
  idColunaOrigem: string,
  idColunaDestino: string,
  novaOrdemCards: string[] 
) {
  try {
    const { banco, quadro } = await obterBancoEQuadro();

    const colunaOrigem = quadro.colunas.find((c: ColunaProps) => c.idDaColuna === idColunaOrigem);
    const colunaDestino = quadro.colunas.find((c: ColunaProps) => c.idDaColuna === idColunaDestino);

    if (!colunaOrigem || !colunaDestino) throw new Error("Colunas inválidas.");

    // Encontra o card que está a ser movido
    const cardMovido = colunaOrigem.cards.find((c: CardProps) => c.id === cardId);
    if (!cardMovido) throw new Error("Card não encontrado na coluna de origem.");

    // Remove da coluna de origem
    colunaOrigem.cards = colunaOrigem.cards.filter((c: CardProps) => c.id !== cardId);

    // Se mudou de coluna, injeta o card na destino antes de reordenar
    if (idColunaOrigem !== idColunaDestino) {
      colunaDestino.cards.push(cardMovido);
    }

    // Ordena os cards da coluna de destino e remove possíveis undefined
    colunaDestino.cards = novaOrdemCards
      .map((id) => {
        if (id === cardId && idColunaOrigem !== idColunaDestino) return cardMovido;
        return colunaDestino.cards.find((c: CardProps) => c.id === id);
      })
      .filter((card): card is CardProps => card !== undefined);

    await salvarBanco(banco);
    revalidatePath("/dashboard/kanban");
    return { sucesso: true };
  } catch (error: unknown) {
    if (error instanceof Error) return { sucesso: false, erro: error.message };
    return { sucesso: false, erro: "Ocorreu um erro desconhecido." };
  }
}

export async function agendarReuniaoAction(clienteId: string | number, novaReuniao: { id: string; data: string; assunto: string }) {
  try {
    const { banco, quadro } = await obterBancoEQuadro();

    let cardAtualizado = false;

    quadro.colunas.forEach((coluna: ColunaProps) => {
      coluna.cards.forEach((card: CardProps) => {
        // Converte para string para garantir a comparação correta
        if (card.id === String(clienteId)) { 
          if (!card.atividades) card.atividades = [];
          
          card.atividades.push(novaReuniao);
          cardAtualizado = true;
        }
      });
    });

    if (!cardAtualizado) {
      throw new Error("Negociação não encontrada neste quadro.");
    }

    await salvarBanco(banco);
    revalidatePath("/dashboard/kanban"); 
    
    return { sucesso: true };
  } catch (error: unknown) {
    if (error instanceof Error) return { sucesso: false, erro: error.message };
    return { sucesso: false, erro: "Ocorreu um erro desconhecido." };
  }
}