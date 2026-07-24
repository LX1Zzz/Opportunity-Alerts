import Link from "next/link";
import { signUp } from "@/app/actions/auth";

export default function CriarContaPage({
  searchParams,
}: {
  searchParams: { erro?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
            Opportunity Alerts
          </span>
          <h1 className="font-display text-2xl font-medium text-ink">
            Criar sua conta
          </h1>
        </div>

        {searchParams.erro && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {searchParams.erro}
          </div>
        )}

        <form action={signUp} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-ink"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink/40"
            />
            <span className="text-xs text-slate">Mínimo de 6 caracteres.</span>
          </div>

          <button
            type="submit"
            className="mt-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-deep"
          >
            Criar conta
          </button>
        </form>

        <p className="mt-6 text-sm text-slate">
          Já tem conta?{" "}
          <Link href="/entrar" className="font-medium text-ink underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
