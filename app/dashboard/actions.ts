"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function savePreferences(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  const categoryIds = formData.getAll("categories") as string[];
  const sourceIds = formData.getAll("sources") as string[];

  if (categoryIds.length === 0) {
    redirect(
      `/dashboard?erro=${encodeURIComponent(
        "Escolha ao menos uma categoria."
      )}`
    );
  }

  // Se nenhuma fonte foi marcada, cada categoria vira uma preferência
  // "de qualquer fonte" (source_id nulo). Se fontes foram marcadas,
  // criamos uma linha para cada combinação categoria + fonte.
  type PreferenceRow = {
    user_id: string;
    category_id: string;
    source_id: string | null;
  };

  const rows: PreferenceRow[] =
    sourceIds.length === 0
      ? categoryIds.map((categoryId) => ({
          user_id: user.id,
          category_id: categoryId,
          source_id: null,
        }))
      : categoryIds.flatMap((categoryId) =>
          sourceIds.map((sourceId) => ({
            user_id: user.id,
            category_id: categoryId,
            source_id: sourceId,
          }))
        );

  const { error } = await supabase.from("user_preferences").insert(rows);

  if (error) {
    redirect(`/dashboard?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?salvo=1");
}

export async function removePreference(formData: FormData) {
  const supabase = createClient();
  const id = formData.get("id") as string;

  // Não precisamos checar "esse id é seu mesmo?" aqui no código —
  // a política de RLS do banco (Fase 3) já impede apagar linha de
  // outro usuário, mesmo que alguém tente enviar um id adivinhado.
  await supabase.from("user_preferences").delete().eq("id", id);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
