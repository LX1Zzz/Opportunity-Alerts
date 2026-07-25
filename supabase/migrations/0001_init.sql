-- ============================================================
-- Fase 3: categories, sources, user_preferences
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: categories
-- Lista fixa de categorias de oportunidade. Não depende de
-- usuário nenhum — é a mesma para todo mundo.
-- ------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

-- Qualquer pessoa (logada ou não) pode LER as categorias.
create policy "categories_select_all"
  on categories for select
  using (true);

-- Ninguém insere/edita/apaga categoria pelo app (isso é feito
-- manualmente por nós, via SQL Editor, quando necessário).

-- ------------------------------------------------------------
-- Tabela: sources
-- As fontes monitoradas (universidades, escritórios, empresas).
-- ------------------------------------------------------------
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null check (type in ('universidade', 'escritorio', 'empresa')),
  url text not null,
  created_at timestamptz not null default now()
);

alter table sources enable row level security;

-- Qualquer pessoa pode LER as fontes.
create policy "sources_select_all"
  on sources for select
  using (true);

-- ------------------------------------------------------------
-- Tabela: user_preferences
-- Liga um usuário a uma categoria e, opcionalmente, a uma fonte
-- específica. Se source_id for nulo, significa "qualquer fonte
-- dentro dessa categoria".
-- ------------------------------------------------------------
create table if not exists user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  source_id uuid references sources(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table user_preferences enable row level security;

-- Cada usuário só pode LER as próprias preferências.
create policy "user_preferences_select_own"
  on user_preferences for select
  using (auth.uid() = user_id);

-- Cada usuário só pode CRIAR preferências para si mesmo.
create policy "user_preferences_insert_own"
  on user_preferences for insert
  with check (auth.uid() = user_id);

-- Cada usuário só pode APAGAR as próprias preferências.
create policy "user_preferences_delete_own"
  on user_preferences for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Dados iniciais (seed)
-- ON CONFLICT DO NOTHING: se você rodar esse arquivo de novo por
-- engano, ele não duplica os dados nem dá erro.
-- ------------------------------------------------------------
insert into categories (name, slug) values
  ('Estágio', 'estagio'),
  ('Trainee', 'trainee'),
  ('Monitoria', 'monitoria'),
  ('Iniciação Científica', 'iniciacao-cientifica'),
  ('Bolsa', 'bolsa'),
  ('Intercâmbio', 'intercambio'),
  ('Hackathon', 'hackathon'),
  ('Incubadora', 'incubadora'),
  ('Evento', 'evento'),
  ('Concurso', 'concurso'),
  ('Aceleração', 'aceleracao')
on conflict (slug) do nothing;

insert into sources (name, type, url) values
  ('Mackenzie', 'universidade', 'https://www.mackenzie.br'),
  ('USP Direito', 'universidade', 'https://www.direito.usp.br'),
  ('PUC', 'universidade', 'https://www.pucsp.br'),
  ('FGV', 'universidade', 'https://www.fgv.br'),
  ('Pinheiro Neto', 'escritorio', 'https://www.pinheironeto.com.br'),
  ('Mattos Filho', 'escritorio', 'https://www.mattosfilho.com.br')
on conflict (name) do nothing;
