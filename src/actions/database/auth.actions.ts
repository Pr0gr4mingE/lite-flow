"use server";

import fs from "fs/promises";
import path from "path";

// 1. Tipagem estrita para o Usuário
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

// 2. Caminho absoluto para o arquivo users.json
const caminhoArquivo = path.join(process.cwd(), "src", "infrastructure", "database", "users.json");

// Função auxiliar interna para ler o arquivo
async function lerBancoUsuarios(): Promise<UsersDatabase> {
  try {
    const conteudo = await fs.readFile(caminhoArquivo, "utf-8");
    return JSON.parse(conteudo);
  } catch (error) {
    // Se o arquivo não existir ou der erro, retorna a estrutura inicial vazia
    return { usuarios: [] };
  }
}

// 3. A Ação que será chamada pelo Front-end
export async function cadastrarUsuarioAction(dadosFormulario: Omit<UsuarioProps, "id" | "criadoEm">) {
  const banco = await lerBancoUsuarios();

  // Verifica se o e-mail já está cadastrado
  const usuarioExistente = banco.usuarios.find((u) => u.email === dadosFormulario.email);
  
  if (usuarioExistente) {
    return { sucesso: false, mensagem: "Este e-mail já está em uso." };
  }

  // Monta o novo usuário
  const novoUsuario: UsuarioProps = {
    id: crypto.randomUUID(),
    nome: dadosFormulario.nome,
    email: dadosFormulario.email,
    senha: dadosFormulario.senha,
    criadoEm: new Date().toISOString(),
  };

  // Adiciona ao banco e salva no arquivo
  banco.usuarios.push(novoUsuario);
  await fs.writeFile(caminhoArquivo, JSON.stringify(banco, null, 2), "utf-8");

  return { sucesso: true, mensagem: "Conta criada com sucesso!" };
}