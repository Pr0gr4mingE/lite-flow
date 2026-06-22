"use client";

import { useState, FormEvent } from "react"; // 1. Importamos o FormEvent

// 2. Criamos o "contrato" exato do que o formulário vai enviar
export interface DadosNovaNegociacao {
  titulo: string;
  empresa: string;
  valor: number;
  valorFormatado: string;
}

interface FormProps {
  onSalvar: (dados: DadosNovaNegociacao) => void; // 3. Adeus, 'any'!
  onCancelar: () => void;
}

export function FormNovaNegociacao({ onSalvar, onCancelar }: FormProps) {
  const [titulo, setTitulo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [valor, setValor] = useState("");

  // 4. Tipamos o evento especificamente para um elemento de formulário HTML
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Agora o TypeScript sabe que este objeto respeita a interface DadosNovaNegociacao
    onSalvar({
      titulo,
      empresa,
      valor: Number(valor.replace(/\D/g, "")),
      valorFormatado: `R$ ${valor}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título da Negociação</label>
        <input
          required
          type="text"
          placeholder="Ex: Licença 10 usuários"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa / Cliente</label>
        <input
          required
          type="text"
          placeholder="Ex: TechCorp"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado (R$)</label>
        <input
          required
          type="number"
          placeholder="5000"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Adicionar Card
        </button>
      </div>
    </form>
  );
}