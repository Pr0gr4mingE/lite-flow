export interface KanbanCardProps {
  id: string | number;
  titulo: string;                // Vai receber o titulo da Negociacao
  subtitulo?: string;            // Pode ser o nome da Empresa/Cliente
  valorFormatado?: string;       // Ex: "R$ 5.000,00" (já em string, não em number)
  corDestaque?: 'azul' | 'verde' | 'cinza'; // Para pintar a borda do card
  aoClicar?: () => void;         // Ação de abrir detalhes
}