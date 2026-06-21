export type BadgeVariant = 'sucesso' | 'alerta' | 'erro' | 'neutro';

export interface BadgeProps {
  texto: string;
  variante: BadgeVariant; // A UI decide a cor baseada na variante, não na regra de negócio
}