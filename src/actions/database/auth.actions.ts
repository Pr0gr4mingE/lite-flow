"use server";

import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// Importando as tipagens do seu CRM para garantir que o quadro seja criado perfeitamente
import { BancoDeDadosProps, QuadroProps, ColunaProps } from "@/actions/crm.actions"; 

// 1. Definimos os tipos
export interface UsuarioProps {
  id: string;
  nome: string;
  email: string;
  senha: string; 
  criadoEm: string;
}

interface UsersDatabase {
  usuarios: UsuarioProps[];
}

// 2. Caminhos absolutos para os arquivos JSON (Bancos separados!)
const caminhoUsuarios = path.join(process.cwd(), "src", "infrastructure", "database", "users.json");
const caminhoCrm = path.join(process.cwd(), "src", "infrastructure", "database", "db.json");

// 3. Função auxiliar de leitura
async function lerBancoUsuarios(): Promise<UsersDatabase> {
  try {
    const conteudo = await fs.readFile(caminhoUsuarios, "utf-8");
    return JSON.parse(conteudo);
  } catch (error) {
    // Se o arquivo não existir ou der erro, retorna a estrutura inicial vazia
    return { usuarios: [] };
  }
}

// ==========================================
// SERVER ACTIONS
// ==========================================

export async function cadastrarUsuarioAction(dadosFormulario: Omit<UsuarioProps, "id" | "criadoEm">) {
  const bancoUsuarios = await lerBancoUsuarios();

  const usuarioExistente = bancoUsuarios.usuarios.find((u: UsuarioProps) => u.email === dadosFormulario.email);
  
  if (usuarioExistente) {
    return { sucesso: false, mensagem: "Este e-mail já está em uso." };
  }

  // Cria o Usuário
  const novoUsuario: UsuarioProps = {
    id: crypto.randomUUID(),
    nome: dadosFormulario.nome,
    email: dadosFormulario.email,
    senha: dadosFormulario.senha,
    criadoEm: new Date().toISOString(),
  };

  bancoUsuarios.usuarios.push(novoUsuario);
  await fs.writeFile(caminhoUsuarios, JSON.stringify(bancoUsuarios, null, 2), "utf-8");

  // Cria o Quadro Zerado para o Usuário no db.json tipado
  try {
    const conteudoCrm = await fs.readFile(caminhoCrm, "utf-8");
    const bancoCrm = JSON.parse(conteudoCrm) as BancoDeDadosProps;

    const colunasPadrao: ColunaProps[] = [
      { idDaColuna: "col-1", titulo: "Prospecção", cards: [] },
      { idDaColuna: "col-2", titulo: "Proposta", cards: [] },
      { idDaColuna: "col-3", titulo: "Fechamento", cards: [] }
    ];

    const novoQuadro: QuadroProps = {
      id: crypto.randomUUID(),
      titulo: `Pipeline de ${novoUsuario.nome}`,
      donoId: novoUsuario.id,
      membrosIds: [novoUsuario.id],
      colunas: colunasPadrao
    };

    if (!bancoCrm.quadros) bancoCrm.quadros = [];
    
    bancoCrm.quadros.push(novoQuadro);
    await fs.writeFile(caminhoCrm, JSON.stringify(bancoCrm, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao criar o quadro inicial:", error);
  }

  // Já autentica o usuário automaticamente injetando o cookie
  const cookieStore = await cookies();
  cookieStore.set("crm_session", novoUsuario.id, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, 
    path: "/", 
  });

  return { sucesso: true, mensagem: "Conta e Pipeline criados com sucesso!" };
}

export async function loginAction(email: string, senhaDigitada: string) {
  const bancoUsuarios = await lerBancoUsuarios();

  const usuario = bancoUsuarios.usuarios.find((u: UsuarioProps) => u.email === email);

  // 1. Verifica se o usuário existe
  if (!usuario) {
    return { sucesso: false, mensagem: "Usuário não encontrado." };
  }

  // 2. Verifica a senha
  if (usuario.senha !== senhaDigitada) {
    return { sucesso: false, mensagem: "Senha incorreta." };
  }

  // 3. Cria a Sessão
  const cookieStore = await cookies();
  cookieStore.set("crm_session", usuario.id, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, 
    path: "/", 
  });

  return { sucesso: true, mensagem: "Login efetuado com sucesso!" };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("crm_session");
  redirect("/login");
}

// ==========================================
// AÇÕES DE GERENCIAMENTO DE PERFIL
// ==========================================

export async function editarPerfilAction(dadosAtualizados: { nome?: string; email?: string; senhaAtual?: string; novaSenha?: string }) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("crm_session")?.value;
    if (!userId) return { sucesso: false, mensagem: "Não autenticado." };

    const bancoUsuarios = await lerBancoUsuarios();
    const usuarioIndex = bancoUsuarios.usuarios.findIndex((u: UsuarioProps) => u.id === userId);

    if (usuarioIndex === -1) return { sucesso: false, mensagem: "Usuário não encontrado." };

    const usuario = bancoUsuarios.usuarios[usuarioIndex];

    // Se ele quiser trocar a senha, precisamos validar a senha atual
    if (dadosAtualizados.novaSenha) {
      if (usuario.senha !== dadosAtualizados.senhaAtual) {
        return { sucesso: false, mensagem: "Senha atual incorreta." };
      }
      usuario.senha = dadosAtualizados.novaSenha;
    }

    // Atualiza nome e email se foram enviados
    if (dadosAtualizados.nome) usuario.nome = dadosAtualizados.nome;
    if (dadosAtualizados.email) usuario.email = dadosAtualizados.email;

    bancoUsuarios.usuarios[usuarioIndex] = usuario;
    await fs.writeFile(caminhoUsuarios, JSON.stringify(bancoUsuarios, null, 2), "utf-8");

    return { sucesso: true, mensagem: "Perfil atualizado com sucesso!" };
  } catch (error) {
    return { sucesso: false, mensagem: "Erro ao atualizar perfil." };
  }
}

export async function excluirContaAction() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("crm_session")?.value;
    if (!userId) return { sucesso: false, mensagem: "Não autenticado." };

    // 1. Remove o usuário do users.json
    const bancoUsuarios = await lerBancoUsuarios();
    bancoUsuarios.usuarios = bancoUsuarios.usuarios.filter((u: UsuarioProps) => u.id !== userId);
    await fs.writeFile(caminhoUsuarios, JSON.stringify(bancoUsuarios, null, 2), "utf-8");

   // 2. Remove o quadro dele do db.json
    try {
      const conteudoCrm = await fs.readFile(caminhoCrm, "utf-8");
      const bancoCrm = JSON.parse(conteudoCrm);
      
      if (bancoCrm.quadros) {
        // Substituindo o 'any' pelo 'QuadroProps' que já foi importado
        bancoCrm.quadros = bancoCrm.quadros.filter((q: QuadroProps) => q.donoId !== userId);
        await fs.writeFile(caminhoCrm, JSON.stringify(bancoCrm, null, 2), "utf-8");
      }
    } catch (err) {
      console.error("Erro ao apagar o quadro do usuário:", err);
    }

    // 3. Deleta o cookie e expulsa do sistema
    cookieStore.delete("crm_session");
    
    return { sucesso: true };
  } catch (error) {
    return { sucesso: false, mensagem: "Erro ao excluir conta." };
  }
}