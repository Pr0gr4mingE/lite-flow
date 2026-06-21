import { BadgeProps } from '@/shared/types/ui/badge.props';

export function Badge({ texto, variante }: BadgeProps) {
  // Dicionário de estilos do Tailwind baseado na variante
  const estilosVariante = {
    sucesso: 'bg-green-100 text-green-800 border-green-200',
    alerta: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    erro: 'bg-red-100 text-red-800 border-red-200',
    neutro: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${estilosVariante[variante]}`}
    >
      {texto}
    </span>
  );
}