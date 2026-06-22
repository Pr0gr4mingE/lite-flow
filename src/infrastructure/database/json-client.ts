import fs from 'fs/promises';
import path from 'path';
import { KanbanColumnProps } from '@/shared/types/ui/kanban-board.props';

const dbPath = path.join(process.cwd(), 'src', 'infrastructure', 'database', 'db.json');

// 1. Criamos as interfaces para as novas entidades
export interface LeadProps {
  id: number;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  status: string;
}

export interface ClienteProps {
  id: number;
  nome: string;
  empresa: string;
  cnpj: string;
  valorMensal: number;
  dataEntrada: string;
}

// 2. Expandimos o formato esperado do JSON
export interface JsonDatabase {
  colunas: KanbanColumnProps[];
  leads: LeadProps[];
  clientes: ClienteProps[];
}

export const jsonDb = {
  ler: async (): Promise<JsonDatabase> => {
    try {
      const data = await fs.readFile(dbPath, 'utf-8');
      return JSON.parse(data) as JsonDatabase; 
    } catch (erro) {
      console.error("Erro ao ler db.json", erro);
      // Retornamos arrays vazios por segurança caso o arquivo não exista
      return { colunas: [], leads: [], clientes: [] };
    }
  },

  salvar: async (dados: JsonDatabase): Promise<boolean> => {
    try {
      await fs.writeFile(dbPath, JSON.stringify(dados, null, 2), 'utf-8');
      return true;
    } catch (erro) {
      console.error("Erro ao salvar db.json", erro);
      return false;
    }
  }
};