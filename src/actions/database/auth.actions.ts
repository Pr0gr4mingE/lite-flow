"use server";

import fs from "fs/promises";
import path from "path";

// 1. Definimos os tipos (Isso resolve os problemas com 'any')
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

// 2. Caminhos absolutos para os arquivos JSON
const caminhoUsuarios = path.join(process.cwd(), "src", "infrastructure", "database", "users.json");
const caminhoCrm = path.join(process.cwd(), "src", "infrastructure", "database", "db.json");

// 3. A função que o VS Code não estava achando precisa estar aqui
async function lerBancoUsuarios(): Promise<UsersDatabase> {
  try {
    const conteudo = await fs.readFile(caminhoUsuarios, "utf-8");
    return JSON.parse(conteudo);
  } catch (error) {
    // Se o arquivo não existir ou der erro, retorna a estrutura inicial vazia
    return { usuarios: [] };
  }
}

// 4. Ação principal tipada (sem 'any')
// Usamos Omit porque quando o formulário é enviado, ele ainda não tem 'id' nem 'criadoEm'
export async function cadastrarUsuarioAction(dadosFormulario: Omit<UsuarioProps, "id" | "criadoEm">) {
  const bancoUsuarios = await lerBancoUsuarios();

  // Tipamos o 'u' como UsuarioProps
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

  // Cria o Quadro Zerado para o Usuário no db.json
  try {
    const conteudoCrm = await fs.readFile(caminhoCrm, "utf-8");
    const bancoCrm = JSON.parse(conteudoCrm);

    const novoQuadro = {
      id: crypto.randomUUID(),
      titulo: `Pipeline de ${novoUsuario.nome}`,
      donoId: novoUsuario.id,
      membrosIds: [novoUsuario.id], // Ele mesmo já é membro do próprio quadro
      colunas: [
        { idDaColuna: "col-prospeccao", titulo: "Prospecção", cards: [] },
        { idDaColuna: "col-proposta", titulo: "Proposta", cards: [] },
        { idDaColuna: "col-fechamento", titulo: "Fechamento", cards: [] }
      ]
    };

    // Se a propriedade quadros não existir, cria ela
    if (!bancoCrm.quadros) bancoCrm.quadros = [];
    
    bancoCrm.quadros.push(novoQuadro);
    await fs.writeFile(caminhoCrm, JSON.stringify(bancoCrm, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao criar o quadro inicial:", error);
    // Em um sistema real, você faria um "rollback" (apagaria o usuário) se o quadro falhasse.
  }

  return { sucesso: true, mensagem: "Conta e Pipeline criados com sucesso!" };
}