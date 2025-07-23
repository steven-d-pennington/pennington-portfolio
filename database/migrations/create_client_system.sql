-- client system migration: separate clients from users
-- this creates a proper business entity structure for client management

-- 1. create client_companies table
create table if not exists client_companies (
    id uuid default gen_random_uuid() primary key,
    company_name text not null,
    industry text,
    website text,
    address text,
    phone text,
    email text, -- main company email
    billing_address text,
    tax_id text,
    status text not null default 'active' check (status in ('active', 'inactive', 'prospect')),
    owner_contact_id uuid, -- will reference client_contacts(id) - set after contact creation
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 2. create client_contacts table  
create table if not exists client_contacts (
    id uuid default gen_random_uuid() primary key,
    client_company_id uuid not null references client_companies(id) on delete cascade,
    full_name text not null,
    email text not null unique,
    phone text,
    title text, -- job title
    department text,
    role text not null default 'member' check (role in ('owner', 'tech', 'media', 'finance', 'member')),
    is_primary_contact boolean default false,
    is_billing_contact boolean default false,
    can_manage_team boolean default false, -- only owner + system admins can add contacts
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 3. add foreign key constraint from companies back to owner contact
alter table client_companies 
add constraint fk_owner_contact 
foreign key (owner_contact_id) references client_contacts(id);

-- 4. create indexes for performance
create index if not exists idx_client_companies_status on client_companies(status);
create index if not exists idx_client_companies_company_name on client_companies(company_name);
create index if not exists idx_client_contacts_company_id on client_contacts(client_company_id);
create index if not exists idx_client_contacts_email on client_contacts(email);
create index if not exists idx_client_contacts_role on client_contacts(role);

-- 5. add column to projects table to reference client companies
alter table projects 
add column if not exists client_company_id uuid references client_companies(id);

-- 6. create index for project-client relationship
create index if not exists idx_projects_client_company_id on projects(client_company_id);

-- 7. row level security (rls) policies
alter table client_companies enable row level security;
alter table client_contacts enable row level security;

-- policy: system admins can see all client companies
create policy "system admins can view all client companies" 
on client_companies for select 
to authenticated 
using (
    exists (
        select 1 from user_profiles 
        where user_profiles.id = auth.uid() 
        and user_profiles.role in ('admin', 'team_member')
    )
);

-- policy: system admins can manage all client companies
create policy "system admins can manage client companies" 
on client_companies for all 
to authenticated 
using (
    exists (
        select 1 from user_profiles 
        where user_profiles.id = auth.uid() 
        and user_profiles.role in ('admin', 'team_member')
    )
);

-- policy: system admins can see all client contacts
create policy "system admins can view all client contacts" 
on client_contacts for select 
to authenticated 
using (
    exists (
        select 1 from user_profiles 
        where user_profiles.id = auth.uid() 
        and user_profiles.role in ('admin', 'team_member')
    )
);

-- policy: system admins can manage all client contacts
create policy "system admins can manage all client contacts" 
on client_contacts for all 
to authenticated 
using (
    exists (
        select 1 from user_profiles 
        where user_profiles.id = auth.uid() 
        and user_profiles.role in ('admin', 'team_member')
    )
);

-- policy: client contacts can only see contacts from their own company
-- (this will be used when we add client dashboard access later)
create policy "client contacts can view own company contacts" 
on client_contacts for select 
to authenticated 
using (
    -- allow if user is a client contact viewing their own company
    client_company_id in (
        select cc.client_company_id 
        from client_contacts cc 
        join user_profiles up on cc.email = up.email 
        where up.id = auth.uid()
    )
);

-- policy: only company owners can add new contacts to their company
-- (this will be used when we add client dashboard access later)
create policy "company owners can manage their team" 
on client_contacts for insert 
to authenticated 
with check (
    -- allow if user is the company owner
    client_company_id in (
        select cc.client_company_id 
        from client_contacts cc 
        join user_profiles up on cc.email = up.email 
        where up.id = auth.uid() 
        and cc.can_manage_team = true
    )
);

-- 8. functions for maintaining data integrity

-- function to automatically set owner as team manager
create or replace function set_owner_as_team_manager()
returns trigger as $$
begin
    -- if this is an owner role, set can_manage_team to true
    if new.role = 'owner' then
        new.can_manage_team = true;
    end if;
    
    return new;
end;
$$ language plpgsql;

-- trigger to automatically set team management for owners
create trigger trigger_set_owner_as_team_manager
    before insert or update on client_contacts
    for each row
    execute function set_owner_as_team_manager();

-- function to ensure only one owner per company
create or replace function enforce_single_owner_per_company()
returns trigger as $$
begin
    -- check if we're trying to create another owner for the same company
    if new.role = 'owner' and exists (
        select 1 from client_contacts 
        where client_company_id = new.client_company_id 
        and role = 'owner' 
        and id != coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) then
        raise exception 'a company can only have one owner. please change the existing owner role first.';
    end if;
    
    return new;
end;
$$ language plpgsql;

-- trigger to enforce single owner per company
create trigger trigger_enforce_single_owner_per_company
    before insert or update on client_contacts
    for each row
    execute function enforce_single_owner_per_company();

-- 9. grant permissions
grant select, insert, update, delete on client_companies to authenticated;
grant select, insert, update, delete on client_contacts to authenticated;

-- 10. comments for documentation
comment on table client_companies is 'business entities that are clients of the company';
comment on table client_contacts is 'individual people at client companies with defined roles';
comment on column client_companies.owner_contact_id is 'references the primary owner contact for this company';
comment on column client_contacts.can_manage_team is 'whether this contact can add/manage other contacts in their company';
comment on column client_contacts.role is 'business role: owner (can manage team), tech, media, finance, or general member';

-- migration complete - client system ready for use