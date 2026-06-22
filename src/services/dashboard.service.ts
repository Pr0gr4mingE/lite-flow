import { jsonDb } from "@/infrastructure/database/json-client";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";

export async function obterMetricasDoPipeline() {
  const banco = await jsonDb.ler();
  
  // Tipamos o array que vem do banco
  const colunas: KanbanColumnProps[] = banco.colunas;

  let somaNegociacao = 0;
  let somaFechados = 0;
  let qtdTotalCards = 0;
  let qtdFechados = 0;

  // Substituímos os "any" pelos tipos corretos nas iterações
  colunas.forEach((coluna: KanbanColumnProps) => {
    coluna.cards.forEach((card: KanbanCardProps) => {
      qtdTotalCards++;
      
      const valorLimpo = (card.valorFormatado || "0").replace(/[R$\s.]/g, "").replace(",", ".");
      const valorNumerico = parseFloat(valorLimpo) || 0;

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