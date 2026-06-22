export default function ClientesPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-500 mt-1">Carteira de clientes ativos e histórico.</p>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        {/* Aqui vai entrar a tabela de Clientes no futuro */}
        <div className="text-center text-gray-500 mt-10">
          Nenhum cliente cadastrado ainda.
        </div>
      </div>
    </div>
  );
}