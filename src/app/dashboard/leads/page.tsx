import { jsonDb } from "@/infrastructure/database/json-client";
import { KanbanColumnProps } from "@/shared/types/ui/kanban-board.props";
import { KanbanCardProps } from "@/shared/types/ui/kanban-card.props";
import { LeadsClient } from "@/components/features/leads/leads-client";
import { LeadProps } from "@/hooks/leads/use-leads";
import { AtividadeReuniao } from "@/hooks/leads/use-leads";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ==========================================
// 1. TIPAGENS DO MULTI-TENANT
// ==========================================
interface QuadroProps {
  id: string;
  titulo: string;
  donoId: string;
  membrosIds: string[];
  colunas: KanbanColumnProps[];
}

interface BancoDeDadosProps {
  quadros: QuadroProps[];
}

export default async function LeadsPage() {
  // 2. Controle de Sessão
  const cookieStore = await cookies();
  const userId = cookieStore.get("crm_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  // 3. Lê o banco já na nova estrutura
  const banco = (await jsonDb.ler()) as unknown as BancoDeDadosProps;
  
  // 4. Isola apenas o quadro do usuário logado
  const quadros = banco.quadros || [];
  const quadroDoUsuario = quadros.find((q: QuadroProps) => q.membrosIds.includes(userId));

  if (!quadroDoUsuario) {
    redirect("/login");
  }

  // 5. Procura a coluna de Prospecção SOMENTE dentro do quadro deste usuário
  const colunaProspeccao = quadroDoUsuario.colunas.find(
    (c: KanbanColumnProps) => c.titulo.toLowerCase().includes("prospecção")
  );

  // Se a coluna existir, pegamos os cards. Se não, array vazio.
  const leadsBrutos = colunaProspeccao ? colunaProspeccao.cards : [];

  // Mapeamos para garantir que o Client Component receba o formato correto
  const leadsIniciais: LeadProps[] = leadsBrutos.map((cardBase: KanbanCardProps) => {
    // Agora o TypeScript sabe exatamente o formato das atividades escondidas no JSON
    const card = cardBase as KanbanCardProps & { atividades?: AtividadeReuniao[] };
    
    return {
      ...card,
      atividades: card.atividades || [], 
    };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads em Prospecção</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie seus clientes potenciais e agende reuniões de qualificação.
        </p>
      </div>

      {/* Injeta os dados protegidos no Client Component */}
      <LeadsClient leadsIniciais={leadsIniciais} />
    </div>
  );
}