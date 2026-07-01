"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editarPerfilAction, excluirContaAction } from "@/actions/database/auth.actions";

export default function PerfilPage() {
  const router = useRouter();
  
  // Estados de Edição
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  
  // Estados de UX
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: "sucesso" | "erro" } | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem(null);

    const dadosParaAtualizar = {
      ...(nome && { nome }),
      ...(email && { email }),
      ...(senhaAtual && novaSenha && { senhaAtual, novaSenha }),
    };

    const resposta = await editarPerfilAction(dadosParaAtualizar);

    if (resposta.sucesso) {
      setMensagem({ texto: resposta.mensagem || "Salvo com sucesso!", tipo: "sucesso" });
      setSenhaAtual("");
      setNovaSenha("");
      router.refresh(); // Atualiza o estado da página
    } else {
      setMensagem({ texto: resposta.mensagem || "Erro ao salvar.", tipo: "erro" });
    }
    
    setCarregando(false);
  };

  const handleExcluirConta = async () => {
    const confirmacao = window.confirm(
      "TEM CERTEZA? Essa ação vai apagar sua conta, seus leads, clientes e todo o seu pipeline para sempre."
    );

    if (!confirmacao) return;

    setCarregando(true);
    const resposta = await excluirContaAction();

    if (resposta.sucesso) {
      router.refresh();
      router.push("/login");
    } else {
      setMensagem({ texto: resposta.mensagem || "Erro ao excluir conta.", tipo: "erro" });
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">
          Atualize suas informações pessoais ou gerencie sua conta.
        </p>
      </div>

      {mensagem && (
        <div className={`p-4 rounded-md text-sm border ${mensagem.tipo === "sucesso" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {mensagem.texto}
        </div>
      )}

      {/* Formulário de Edição */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSalvar} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Novo Nome</label>
              <input
                type="text"
                placeholder="Deixe em branco para não alterar"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Novo E-mail</label>
              <input
                type="email"
                placeholder="Deixe em branco para não alterar"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Trocar Senha</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                <input
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                <input
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={carregando}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {carregando ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>

      {/* Zona de Perigo */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 mt-8">
        <h3 className="text-lg font-medium text-red-800">Zona de Perigo</h3>
        <p className="text-sm text-red-600 mt-1 mb-4">
          Ao excluir sua conta, todos os seus dados serão apagados permanentemente. Essa ação não pode ser desfeita.
        </p>
        <button
          onClick={handleExcluirConta}
          disabled={carregando}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium disabled:opacity-50 transition-colors"
        >
          Excluir minha conta
        </button>
      </div>
    </div>
  );
}