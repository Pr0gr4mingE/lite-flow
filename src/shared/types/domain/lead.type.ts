export type LeadStatus = 'Novo' | 'Em Contato' | 'Qualificado' | 'Perdido';

export interface LeadProps {
  id: number;
  nome: string;
  email: string;
  origem: string;
  status: LeadStatus | string;
}