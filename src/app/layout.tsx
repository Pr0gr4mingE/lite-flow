import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../assets/styles/globals.css";

// Configuração da fonte principal do projeto
const inter = Inter({ subsets: ["latin"] });

// Metadados que ajudam no SEO e na aba do navegador
export const metadata: Metadata = {
  title: "LiteFlow CRM",
  description: "Gestão simplificada de pipeline e clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* O children aqui vai renderizar as páginas ou os layouts aninhados, como o seu Dashboard */}
        {children}
      </body>
    </html>
  );
}