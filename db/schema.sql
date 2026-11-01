create table if not exists design_systems (
  id          text primary key,
  name        text not null,
  data        jsonb not null,
  brief       text,
  created_at  timestamptz not null default now()
);

create table if not exists purchases (
  id                 text primary key,
  -- 'tessera' for the base system (defined in code), otherwise a design_systems id
  system_id          text not null,
  plan               text not null check (plan in ('base', 'custom')),
  stripe_session_id  text unique not null,
  email              text,
  status             text not null default 'pending' check (status in ('pending', 'paid')),
  -- entered in the Figma plugin to import the system; only accepted once status = 'paid'
  figma_code         text unique,
  created_at         timestamptz not null default now()
);

alter table purchases add column if not exists figma_code text unique;

create index if not exists purchases_system_idx on purchases(system_id);
