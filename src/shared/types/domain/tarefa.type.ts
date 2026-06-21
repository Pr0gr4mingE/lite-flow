export interface TarefaProps {
  id: number;
  descricao: string;
  prazo: Date;
  negociacaoId: number; // Chave estrangeira ligando à NegociacaoProps
  concluida: boolean;
}