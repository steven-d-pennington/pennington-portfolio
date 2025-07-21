create table public.user_profiles (
  id uuid not null,
  email text null,
  full_name text null,
  avatar_url text null,
  role text null default 'user'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint user_profiles_pkey primary key (id),
  constraint user_profiles_email_key unique (email),
  constraint user_profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint user_profiles_role_check check (
    (
      role = any (
        array['user'::text, 'admin'::text, 'moderator'::text]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_user_profiles_email on public.user_profiles using btree (email) TABLESPACE pg_default;

create index IF not exists idx_user_profiles_role on public.user_profiles using btree (role) TABLESPACE pg_default;

create trigger set_updated_at BEFORE
update on user_profiles for EACH row
execute FUNCTION handle_updated_at ();