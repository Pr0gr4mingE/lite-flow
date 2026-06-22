export default function TarefasPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
        <p className="text-gray-500 mt-1">Gerenciamento de atividades diárias, reuniões e lembretes.</p>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        {/* Aqui vai entrar a lista de Tarefas (to-do list) no futuro */}
        <div className="text-center text-gray-500 mt-10">
          Nenhuma tarefa cadastrada ainda.
        </div>
      </div>
    </div>
  );
}