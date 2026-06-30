import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";

// 1. Recebemos as colunas já filtradas do usuário logado via parâmetro
export async function obterMetricasDoPipeline(colunasDoUsuario: KanbanColumnProps[]) {
  let somaNegociacao = 0;
  let somaFechados = 0;
  let qtdTotalCards = 0;
  let qtdFechados = 0;

  // 2. Substituímos a variável 'colunas' pela que vem no parâmetro
  colunasDoUsuario.forEach((coluna: KanbanColumnProps) => {
    coluna.cards.forEach((card: KanbanCardProps) => {
      qtdTotalCards++;
      
      const valorLimpo = (card.valorFormatado || "0").replace(/[R$\s.]/g, "").replace(",", ".");
      const valorNumerico = parseFloat(valorLimpo) || 0;

      // Mantém a sua regra original onde "col-3" representa os negócios fechados
      if (coluna.idDaColuna === "col-3") {
        somaFechados += valorNumerico;
        qtdFechados++;
      } else {
        somaNegociacao += valorNumerico;
      }
    });
  });

  const taxaConversao = qtdTotalCards > 0 ? Math.round((qtdFechados / qtdTotalCards) * 100) : 0;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };

  return [
    { titulo: 'Total em Negociação', valor: formatarMoeda(somaNegociacao), cor: 'text-blue-600' },
    { titulo: 'Negócios Fechados', valor: formatarMoeda(somaFechados), cor: 'text-green-600' },
    { titulo: 'Taxa de Conversão', valor: `${taxaConversao}%`, cor: 'text-gray-800' },
  ];
}