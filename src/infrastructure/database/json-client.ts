import fs from 'fs/promises';
import path from 'path';
import { KanbanColumnProps } from '@/shared/types/ui/kanban-board.props';

const dbPath = path.join(process.cwd(), 'src', 'infrastructure', 'database', 'db.json');

// 1. Criamos um tipo exato para o formato do nosso JSON
export interface JsonDatabase {
  colunas: KanbanColumnProps[];
}

export const jsonDb = {
  // 2. Avisamos que o retorno desta função é uma Promise que devolve o JsonDatabase
  ler: async (): Promise<JsonDatabase> => {
    try {
      const data = await fs.readFile(dbPath, 'utf-8');
      // Avisamos o TypeScript que o que saiu do JSON obedece a essa interface
      return JSON.parse(data) as JsonDatabase; 
    } catch (erro) {
      console.error("Erro ao ler db.json", erro);
      return { colunas: [] };
    }
  },

  // 3. Substituímos o 'dados: any' por 'dados: JsonDatabase'
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