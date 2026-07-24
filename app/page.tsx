import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

const feedAlerts = [
  {
    time: "07:42",
    source: "PUC-SP",
    title: "Estágio em Direito Tributário",
    tag: "Estágio",
  },
  {
    time: "07:15",
    source: "Mattos Filho",
    title: "Programa de Trainee 2027",
    tag: "Trainee",
  },
  {
    time: "06:58",
    source: "USP Direito",
    title: "Iniciação Científica — Direito Penal",
    tag: "IC",
  },
  {
    time: "06:30",
    source: "Pinheiro Neto",
    title: "Vaga para monitoria de Processo Civil",
    tag: "Monitoria",
  },
];

export default async function Home({
  searchParams,
}: {
  searchParams: { criado?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-16 px-6 py-20 lg:flex-row lg:items-center lg:gap-12">
        {/* Coluna da esquerda: identidade + CTAs */}
        <div className="flex flex-col gap-8 lg:w-1/2">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
              Opportunity Alerts
            </span>
            <h1 className="font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
              Você não vai mais visitar dez sites por dia atrás de edital.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-slate">
              Escolha as instituições, escritórios e categorias que importam
              para você. Quando surgir uma oportunidade compatível, o aviso
              chega até você — não o contrário.
            </p>
          </div>

          {searchParams.criado && (
            <div className="rounded-md border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-ink">
              Conta criada com sucesso.
            </div>
          )}

          {user ? (
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-slate">
                Logado como <span className="text-ink">{user.email}</span>
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-md border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/30"
                >
                  Sair
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              <Link
                href="/criar-conta"
                className="rounded-md bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-deep"
              >
                Criar conta
              </Link>
              <Link
                href="/entrar"
                className="rounded-md border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/30"
              >
                Entrar
              </Link>
            </div>
          )}
        </div>

        {/* Coluna da direita: feed de alertas simulado (elemento de assinatura) */}
        <div className="lg:w-1/2">
          <div className="rounded-lg border border-ink/10 bg-white/60 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal" />
              <span className="font-mono text-xs uppercase tracking-wider text-slate">
                monitorando fontes agora
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {feedAlerts.map((alert, index) => (
                <div
                  key={alert.title}
                  className="alert-card flex items-start justify-between gap-4 rounded-md border border-ink/5 bg-paper px-4 py-3"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-ink">
                      {alert.title}
                    </span>
                    <span className="text-xs text-slate">{alert.source}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono text-xs text-slate">
                      {alert.time}
                    </span>
                    <span className="rounded-full bg-signal/15 px-2 py-0.5 text-[10px] font-medium text-ink">
                      {alert.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
