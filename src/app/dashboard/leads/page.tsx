export default function LeadsPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500 mt-1">Gestão de contatos e prospecções iniciais.</p>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        {/* Aqui vai entrar a tabela de Leads no futuro */}
        <div className="text-center text-gray-500 mt-10">
          Nenhum lead cadastrado ainda.
        </div>
      </div>
    </div>
  );
}