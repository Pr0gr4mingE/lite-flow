export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center">
        {/* Futuramente, o título dinâmico da página pode entrar aqui */}
        <h2 className="text-lg font-semibold text-gray-800">Visão Geral</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-sm text-gray-500 hover:text-gray-700">
          Notificações
        </button>
      </div>
    </header>
  );
}