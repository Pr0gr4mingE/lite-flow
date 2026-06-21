import { KanbanCardProps } from './kanban-card.props';

export interface KanbanColumnProps {
  idDaColuna: string;
  titulo: string;                // Ex: "Prospecção"
  corDoCabecalho: string;        // Hexadecimal ou classe do Tailwind
  cards: KanbanCardProps[];      // Lista de cards que estão nesta coluna
}