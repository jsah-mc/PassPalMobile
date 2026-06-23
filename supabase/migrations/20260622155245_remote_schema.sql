create extension if not exists "wrappers" with schema "extensions";

drop extension if exists "pg_net";


  create table "public"."contacts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "first_name" text not null,
    "last_name" text,
    "email" text,
    "phone" text,
    "company" text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."contacts" enable row level security;


  create table "public"."password_entries" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "site_name" text not null,
    "username" text,
    "encrypted_password" text not null,
    "iv" text not null,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "kdf_salt" text
      );


alter table "public"."password_entries" enable row level security;

CREATE UNIQUE INDEX contacts_pkey ON public.contacts USING btree (id);

CREATE INDEX idx_contacts_user_id ON public.contacts USING btree (user_id);

CREATE INDEX idx_password_entries_user_id ON public.password_entries USING btree (user_id);

CREATE UNIQUE INDEX password_entries_pkey ON public.password_entries USING btree (id);

alter table "public"."contacts" add constraint "contacts_pkey" PRIMARY KEY using index "contacts_pkey";

alter table "public"."password_entries" add constraint "password_entries_pkey" PRIMARY KEY using index "password_entries_pkey";

alter table "public"."contacts" add constraint "contacts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."contacts" validate constraint "contacts_user_id_fkey";

alter table "public"."password_entries" add constraint "password_entries_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."password_entries" validate constraint "password_entries_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.debug_jwt()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  select auth.jwt();
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

grant delete on table "public"."contacts" to "anon";

grant insert on table "public"."contacts" to "anon";

grant references on table "public"."contacts" to "anon";

grant select on table "public"."contacts" to "anon";

grant trigger on table "public"."contacts" to "anon";

grant truncate on table "public"."contacts" to "anon";

grant update on table "public"."contacts" to "anon";

grant delete on table "public"."contacts" to "authenticated";

grant insert on table "public"."contacts" to "authenticated";

grant references on table "public"."contacts" to "authenticated";

grant select on table "public"."contacts" to "authenticated";

grant trigger on table "public"."contacts" to "authenticated";

grant truncate on table "public"."contacts" to "authenticated";

grant update on table "public"."contacts" to "authenticated";

grant delete on table "public"."contacts" to "service_role";

grant insert on table "public"."contacts" to "service_role";

grant references on table "public"."contacts" to "service_role";

grant select on table "public"."contacts" to "service_role";

grant trigger on table "public"."contacts" to "service_role";

grant truncate on table "public"."contacts" to "service_role";

grant update on table "public"."contacts" to "service_role";

grant delete on table "public"."password_entries" to "anon";

grant insert on table "public"."password_entries" to "anon";

grant references on table "public"."password_entries" to "anon";

grant select on table "public"."password_entries" to "anon";

grant trigger on table "public"."password_entries" to "anon";

grant truncate on table "public"."password_entries" to "anon";

grant update on table "public"."password_entries" to "anon";

grant delete on table "public"."password_entries" to "authenticated";

grant insert on table "public"."password_entries" to "authenticated";

grant references on table "public"."password_entries" to "authenticated";

grant select on table "public"."password_entries" to "authenticated";

grant trigger on table "public"."password_entries" to "authenticated";

grant truncate on table "public"."password_entries" to "authenticated";

grant update on table "public"."password_entries" to "authenticated";

grant delete on table "public"."password_entries" to "service_role";

grant insert on table "public"."password_entries" to "service_role";

grant references on table "public"."password_entries" to "service_role";

grant select on table "public"."password_entries" to "service_role";

grant trigger on table "public"."password_entries" to "service_role";

grant truncate on table "public"."password_entries" to "service_role";

grant update on table "public"."password_entries" to "service_role";


  create policy "Users can create own contacts"
  on "public"."contacts"
  as permissive
  for insert
  to public
with check ((user_id = auth.uid()));



  create policy "Users can delete own contacts"
  on "public"."contacts"
  as permissive
  for delete
  to public
using ((user_id = auth.uid()));



  create policy "Users can update own contacts"
  on "public"."contacts"
  as permissive
  for update
  to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));



  create policy "Users can view own contacts"
  on "public"."contacts"
  as permissive
  for select
  to public
using ((user_id = auth.uid()));



  create policy "Users can create own password entries"
  on "public"."password_entries"
  as permissive
  for insert
  to public
with check ((user_id = auth.uid()));



  create policy "Users can delete own password entries"
  on "public"."password_entries"
  as permissive
  for delete
  to public
using ((user_id = auth.uid()));



  create policy "Users can update own password entries"
  on "public"."password_entries"
  as permissive
  for update
  to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));



  create policy "Users can view own password entries"
  on "public"."password_entries"
  as permissive
  for select
  to public
using ((user_id = auth.uid()));


CREATE TRIGGER set_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.password_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


