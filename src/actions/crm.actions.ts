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

// ==========================================
// 5. AÇÕES DE EDIÇÃO E EXCLUSÃO
// ==========================================

export async function editarCardAction(
  cardId: string, 
  dadosAtualizados: { titulo?: string; empresa?: string; valorFormatado?: string }
) {
  try {
    // 1. Pega o banco e o quadro do usuário logado (Segurança!)
    const { banco, quadro } = await obterBancoEQuadro();
    let cardEncontrado = false;

    // 2. Varre as colunas do usuário procurando o card
    quadro.colunas.forEach((coluna: ColunaProps) => {
      coluna.cards.forEach((card: CardProps) => {
        if (card.id === cardId) {
          // 3. Atualiza apenas os campos que foram enviados
          if (dadosAtualizados.titulo) card.titulo = dadosAtualizados.titulo;
          if (dadosAtualizados.empresa) card.empresa = dadosAtualizados.empresa;
          if (dadosAtualizados.valorFormatado) card.valorFormatado = dadosAtualizados.valorFormatado;
          
          cardEncontrado = true;
        }
      });
    });

    if (!cardEncontrado) {
      throw new Error("Card não encontrado neste quadro.");
    }

    // 4. Salva e atualiza as telas
    await salvarBanco(banco);
    revalidatePath("/dashboard/kanban");
    revalidatePath("/leads");
    revalidatePath("/clientes");
    
    return { sucesso: true, mensagem: "Card atualizado com sucesso!" };
  } catch (error: unknown) {
    if (error instanceof Error) return { sucesso: false, erro: error.message };
    return { sucesso: false, erro: "Erro ao editar o card." };
  }
}

export async function excluirCardAction(cardId: string) {
  try {
    const { banco, quadro } = await obterBancoEQuadro();
    let cardRemovido = false;

    // Varre as colunas e filtra o array de cards, removendo o card com o ID informado
    quadro.colunas.forEach((coluna: ColunaProps) => {
      const tamanhoOriginal = coluna.cards.length;
      
      coluna.cards = coluna.cards.filter((card: CardProps) => card.id !== cardId);
      
      // Se o tamanho diminuiu, significa que achamos e removemos o card aqui
      if (coluna.cards.length < tamanhoOriginal) {
        cardRemovido = true;
      }
    });

    if (!cardRemovido) {
      throw new Error("Card não encontrado neste quadro.");
    }

    await salvarBanco(banco);
    revalidatePath("/dashboard/kanban");
    revalidatePath("/leads");
    revalidatePath("/clientes");
    
    return { sucesso: true, mensagem: "Card excluído com sucesso!" };
  } catch (error: unknown) {
    if (error instanceof Error) return { sucesso: false, erro: error.message };
    return { sucesso: false, erro: "Erro ao excluir o card." };
  }
}