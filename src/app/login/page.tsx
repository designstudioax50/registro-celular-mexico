import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="animate-fade-up w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="glass-soft mb-5 flex h-14 w-14 items-center justify-center rounded-2xl">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-sky-glow"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Panel de administración
          </h1>
          <p className="mt-2 text-sm text-ink/55">
            Inicia sesión para configurar tu página
          </p>
        </div>

        <div className="glass rounded-3xl p-7 sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-ink/35">
          Acceso restringido · Solo personal autorizado
        </p>
      </div>
    </main>
  );
}
