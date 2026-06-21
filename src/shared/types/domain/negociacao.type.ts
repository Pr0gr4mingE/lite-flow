export type EtapaFunil = 'Prospecção' | 'Proposta' | 'Fechamento';

export interface NegociacaoProps {
  id: number;
  titulo: string;
  valor: number;
  etapa: EtapaFunil;
  clienteId: number; // Chave estrangeira ligando ao ClienteProps
}