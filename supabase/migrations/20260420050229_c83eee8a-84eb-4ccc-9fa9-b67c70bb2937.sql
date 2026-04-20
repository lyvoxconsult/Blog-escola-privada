
-- Enum de roles
create type public.app_role as enum ('aluno', 'gestor');

-- Profiles (1:1 com auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Roles em tabela separada (segurança)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Função security definer para checar role (evita recursão de RLS)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Função updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- Trigger: cria profile e atribui role 'aluno' por padrão no signup.
-- Para criar gestor: signup com raw_user_meta_data.role = 'gestor'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _role public.app_role;
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));

  _role := coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'aluno');
  insert into public.user_roles (user_id, role) values (new.id, _role);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Gestores can view all profiles"
  on public.profiles for select
  using (public.has_role(auth.uid(), 'gestor'));

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- RLS user_roles
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Gestores can view all roles"
  on public.user_roles for select
  using (public.has_role(auth.uid(), 'gestor'));

create policy "Gestores can manage roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'gestor'))
  with check (public.has_role(auth.uid(), 'gestor'));

-- ============= Lessons (itinerário) =============
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  teacher text not null,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 60,
  zoom_url text,
  status text not null default 'scheduled', -- scheduled | completed | cancelled
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.lessons enable row level security;

create trigger update_lessons_updated_at
before update on public.lessons
for each row execute function public.update_updated_at_column();

create policy "Students view own lessons"
  on public.lessons for select
  using (auth.uid() = student_id);

create policy "Gestores view all lessons"
  on public.lessons for select
  using (public.has_role(auth.uid(), 'gestor'));

create policy "Gestores manage lessons"
  on public.lessons for all
  using (public.has_role(auth.uid(), 'gestor'))
  with check (public.has_role(auth.uid(), 'gestor'));

-- ============= Materials =============
create table public.materials (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  type text not null default 'pdf', -- pdf | video | audio | link
  url text,
  created_at timestamptz not null default now()
);
alter table public.materials enable row level security;

create policy "Students view own materials"
  on public.materials for select
  using (auth.uid() = student_id);

create policy "Gestores manage materials"
  on public.materials for all
  using (public.has_role(auth.uid(), 'gestor'))
  with check (public.has_role(auth.uid(), 'gestor'));

-- ============= Notifications =============
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references auth.users(id) on delete cascade, -- null = broadcast
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;

create policy "Recipients view their notifications"
  on public.notifications for select
  using (auth.uid() = recipient_id or recipient_id is null);

create policy "Recipients can mark as read"
  on public.notifications for update
  using (auth.uid() = recipient_id);

create policy "Gestores manage notifications"
  on public.notifications for all
  using (public.has_role(auth.uid(), 'gestor'))
  with check (public.has_role(auth.uid(), 'gestor'));

-- ============= Progress =============
create table public.progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  skill text not null, -- speaking | listening | reading | writing | grammar | vocabulary
  score int not null default 0 check (score between 0 and 100),
  measured_at timestamptz not null default now()
);
alter table public.progress enable row level security;

create policy "Students view own progress"
  on public.progress for select
  using (auth.uid() = student_id);

create policy "Gestores manage progress"
  on public.progress for all
  using (public.has_role(auth.uid(), 'gestor'))
  with check (public.has_role(auth.uid(), 'gestor'));

create index idx_lessons_student on public.lessons(student_id, scheduled_at);
create index idx_materials_student on public.materials(student_id);
create index idx_notifications_recipient on public.notifications(recipient_id, created_at desc);
create index idx_progress_student on public.progress(student_id, measured_at desc);
