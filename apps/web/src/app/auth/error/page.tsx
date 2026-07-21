import Link from 'next/link';

interface AuthErrorPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export const metadata = {
  title: 'Erro de Autenticação - PM Sessions',
  description: 'Erro durante o processo de login.',
};

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams;
  const error = params.error || 'unknown';

  const getErrorMessage = (err: string) => {
    switch (err) {
      case 'server':
        return 'Ocorreu uma falha interna no servidor ao processar a autenticação.';
      case 'unauthorized':
        return 'Sua conta de e-mail não possui autorização para acessar esta área.';
      case 'invalid_session':
        return 'A sessão fornecida pelo servidor de autenticação é inválida ou expirou.';
      default:
        return 'Ocorreu um erro inesperado durante a autenticação.';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-md shadow-2xl flex flex-col items-center text-center">
        <div className="size-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <svg
            className="size-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-xl font-bold tracking-tight mb-2">Erro de Autenticação</h1>
        <p className="text-sm text-neutral-400 mb-6">{getErrorMessage(error)}</p>

        <Link
          href="/login"
          className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-xl transition-colors inline-block text-center border border-neutral-700"
        >
          Voltar para o Login
        </Link>
      </div>
    </div>
  );
}
