import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { savePreferences, removePreference } from "@/app/dashboard/actions";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { erro?: string; salvo?: string; criado?: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // O middleware já protege essa rota, mas checar de novo aqui é uma
  // segunda camada de segurança barata — nunca custa garantir.
  if (!user) {
    return null;
  }

  const [{ data: categories }, { data: sources }, { data: preferences }] =
    await Promise.all([
      supabase.from("categories").select("id, name").order("name"),
      supabase.from("sources").select("id, name, type").order("name"),
      supabase
        .from("user_preferences")
        .select("id, categories(name), sources(name)")
        .order("created_at", { ascending: false }),
    ]);

  return (
    <main className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
              Opportunity Alerts
            </span>
            <h1 className="font-display text-2xl font-medium text-ink">
              Suas preferências
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-slate underline">
              Voltar ao site
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/30"
              >
                Sair
              </button>
            </form>
          </div>
        </header>

        {searchParams.criado && (
          <div className="rounded-md border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-ink">
            Conta criada com sucesso. Agora escolha o que você quer acompanhar.
          </div>
        )}
        {searchParams.salvo && (
          <div className="rounded-md border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-ink">
            Preferências salvas.
          </div>
        )}
        {searchParams.erro && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {searchParams.erro}
          </div>
        )}

        <form
          action={savePreferences}
          className="flex flex-col gap-8 rounded-lg border border-ink/10 bg-white/60 p-6"
        >
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-medium text-ink">
              Quais categorias você quer acompanhar?
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              {categories?.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 text-sm text-ink"
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={category.id}
                    className="h-4 w-4 rounded border-ink/30"
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-medium text-ink">
              Quer restringir a instituições ou empresas específicas?
            </h2>
            <p className="text-sm text-slate">
              Opcional. Se não marcar nenhuma, você recebe alertas das
              categorias escolhidas acima vindas de{" "}
              <strong>qualquer fonte</strong>.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              {sources?.map((source) => (
                <label
                  key={source.id}
                  className="flex items-center gap-2 text-sm text-ink"
                >
                  <input
                    type="checkbox"
                    name="sources"
                    value={source.id}
                    className="h-4 w-4 rounded border-ink/30"
                  />
                  {source.name}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="self-start rounded-md bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-deep"
          >
            Salvar preferências
          </button>
        </form>

        <div className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-medium text-ink">
            Preferências salvas
          </h2>

          {!preferences || preferences.length === 0 ? (
            <p className="text-sm text-slate">
              Nenhuma preferência salva ainda.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {preferences.map((pref) => (
                <li
                  key={pref.id}
                  className="flex items-center justify-between rounded-md border border-ink/10 bg-white/60 px-4 py-2.5 text-sm"
                >
                  <span className="text-ink">
                    {Array.isArray(pref.categories)
                      ? pref.categories[0]?.name
                      : (pref.categories as { name: string } | null)?.name}
                    {(Array.isArray(pref.sources)
                      ? pref.sources[0]?.name
                      : (pref.sources as { name: string } | null)?.name) ? (
                      <span className="text-slate">
                        {" "}
                        —{" "}
                        {Array.isArray(pref.sources)
                          ? pref.sources[0]?.name
                          : (pref.sources as { name: string } | null)?.name}
                      </span>
                    ) : (
                      <span className="text-slate"> — qualquer fonte</span>
                    )}
                  </span>
                  <form action={removePreference}>
                    <input type="hidden" name="id" value={pref.id} />
                    <button
                      type="submit"
                      className="text-xs font-medium text-slate underline hover:text-ink"
                    >
                      remover
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
