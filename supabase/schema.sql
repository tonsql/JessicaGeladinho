-- Jessica Gourmet — banco de dados Supabase
-- Execute este arquivo no SQL Editor do seu projeto Supabase.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price numeric(10,2) not null default 8.00 check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tracking_code text not null unique,
  customer_name text,
  customer_phone text,
  summary text,
  status text not null default 'confirmed' check (status in ('confirmed', 'packing', 'out_for_delivery', 'delivered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at before update on public.products for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at before update on public.orders for each row execute function public.touch_updated_at();

alter table public.products enable row level security;
alter table public.orders enable row level security;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.orders to authenticated;

-- Produtos: qualquer visitante pode ver os produtos ativos.
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
to anon, authenticated
using (active = true or auth.role() = 'authenticated');

-- Somente usuários autenticados do painel podem alterar produtos.
drop policy if exists "Authenticated can insert products" on public.products;
create policy "Authenticated can insert products" on public.products for insert to authenticated with check (true);
drop policy if exists "Authenticated can update products" on public.products;
create policy "Authenticated can update products" on public.products for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated can delete products" on public.products;
create policy "Authenticated can delete products" on public.products for delete to authenticated using (true);

-- Pedidos não ficam públicos. Apenas o administrador autenticado acessa a tabela.
drop policy if exists "Authenticated can read orders" on public.orders;
create policy "Authenticated can read orders" on public.orders for select to authenticated using (true);
drop policy if exists "Authenticated can insert orders" on public.orders;
create policy "Authenticated can insert orders" on public.orders for insert to authenticated with check (true);
drop policy if exists "Authenticated can update orders" on public.orders;
create policy "Authenticated can update orders" on public.orders for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated can delete orders" on public.orders;
create policy "Authenticated can delete orders" on public.orders for delete to authenticated using (true);

-- Função pública de rastreio. Ela devolve apenas dados seguros do pedido.
create or replace function public.track_order(code_input text)
returns table (
  tracking_code text,
  customer_name text,
  summary text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    o.tracking_code,
    o.customer_name,
    o.summary,
    o.status,
    o.created_at,
    o.updated_at
  from public.orders o
  where upper(o.tracking_code) = upper(trim(code_input))
  limit 1;
$$;

revoke all on function public.track_order(text) from public;
grant execute on function public.track_order(text) to anon, authenticated;

-- Bucket público para fotos de produtos.
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select
to public
using (bucket_id = 'products');

drop policy if exists "Authenticated can upload product images" on storage.objects;
create policy "Authenticated can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'products');

drop policy if exists "Authenticated can update product images" on storage.objects;
create policy "Authenticated can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'products')
with check (bucket_id = 'products');

drop policy if exists "Authenticated can delete product images" on storage.objects;
create policy "Authenticated can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'products');

-- Sabores iniciais. Você poderá editar tudo no painel depois.
insert into public.products (name, price, stock, sort_order)
values
  ('Morango com Nutella', 8.00, 20, 1),
  ('Chocolate com Nutella', 8.00, 20, 2),
  ('Mousse de Maracujá', 8.00, 20, 3),
  ('Brigadeiro', 8.00, 20, 4),
  ('Coco Cremoso', 8.00, 20, 5),
  ('Paçoca', 8.00, 20, 6)
on conflict (name) do nothing;
