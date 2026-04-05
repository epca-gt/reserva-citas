-- Ejecuta este SQL en Supabase > SQL Editor

create table reservas (
  id uuid default gen_random_uuid() primary key,
  restaurante text not null,
  nombre text not null,
  telefono text not null,
  fecha date not null,
  hora text not null,
  personas text not null,
  ocasion text,
  notas text,
  estado text default 'pendiente',
  created_at timestamptz default now()
);

-- Permite insertar y leer sin autenticación (para el demo)
alter table reservas enable row level security;

create policy "Permitir insertar" on reservas
  for insert with check (true);

create policy "Permitir leer" on reservas
  for select using (true);

create policy "Permitir actualizar" on reservas
  for update using (true);
