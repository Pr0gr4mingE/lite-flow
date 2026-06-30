import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Tenta pegar o "crachá" do usuário (o cookie de sessão)
  const session = request.cookies.get("crm_session")?.value;

  // 2. Define quais URLs são "área VIP" (rotas protegidas)
  // Adicionei as rotas que refatoramos: dashboard, leads, clientes e tarefas
  const protectedRoutes = ["/dashboard", "/leads", "/clientes", "/tarefas"];
  
  // Verifica se a rota atual começa com alguma das rotas protegidas
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 3. REGRA DE BLOQUEIO: Quer entrar na área VIP sem crachá? Vai pro login.
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. REGRA DE CONFORTO (Opcional): Se o cara já tá logado e entra na página de login,
  // manda ele direto pro trabalho, pra ele não ter que logar de novo à toa.
  if (request.nextUrl.pathname === "/login" && session) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 5. Se passou em tudo, deixa seguir a vida normalmente.
  return NextResponse.next();
}

// 6. OTIMIZAÇÃO: Avisa ao Next.js para não rodar esse middleware em imagens, APIs ou arquivos estáticos
export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas, EXCETO:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos do Next)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (ícone do site)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};