import Link from 'next/link';

export function Sidebar() {
  const menuItens = [
    { nome: 'Pipeline (Kanban)', rota: '/dashboard/pipeline' },
    { nome: 'Leads', rota: '/dashboard/leads' },
    { nome: 'Clientes', rota: '/dashboard/clientes' },
    { nome: 'Tarefas', rota: '/dashboard/tarefas' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wider text-blue-400">LiteFlow</h1>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {menuItens.map((item) => (
            <li key={item.rota}>
              <Link
                href={item.rota}
                className="block px-3 py-2.5 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                {item.nome}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            U
          </div>
          <div className="text-sm">
            <p className="font-medium">Usuário Vendas</p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}