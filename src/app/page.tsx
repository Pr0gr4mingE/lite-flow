import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-xl px-4">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Lite Flow <span className="text-blue-600">CRM</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Gestão de pipeline, leads e clientes de forma visual, rápida e sem complicações.
        </p>
        
        <Link
          href="/dashboard/kanban"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md text-lg"
        >
          Acessar o Sistema
        </Link>
      </div>
    </div>
  );
}