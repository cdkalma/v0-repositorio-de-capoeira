/**
 * Operaciones de usuarios contra Supabase.
 * Solo se usa en server-side (API routes).
 */

import bcrypt from "bcryptjs"
import { createAdminClient } from "@/lib/supabase/admin"
import type { AppUser } from "./users"

// ── Row type from Supabase ──────────────────────────────────────────
interface UsuarioRow {
  id: string
  username: string
  password_hash: string
  name: string
  email: string | null
  role: "admin" | "member"
  apodo: string | null
}

function rowToUser(row: UsuarioRow): AppUser {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    email: row.email,
    role: row.role,
    apodo: row.apodo,
  }
}

// ── Verificar credenciales ──────────────────────────────────────────
export async function verifyCredentials(
  username: string,
  password: string
): Promise<AppUser | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("username", username)
    .single()

  if (error || !data) return null

  const valid = await bcrypt.compare(password, (data as UsuarioRow).password_hash)
  if (!valid) return null

  return rowToUser(data as UsuarioRow)
}

// ── Obtener todos los usuarios (sin password_hash) ──────────────────
export async function getAllUsers(): Promise<AppUser[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, username, name, email, role, apodo, created_at")
    .order("created_at", { ascending: true })

  if (error || !data) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map(rowToUser)
}

// ── Obtener un usuario por ID ───────────────────────────────────────
export async function getUserById(id: string): Promise<AppUser | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, username, name, email, role, apodo")
    .eq("id", id)
    .single()

  if (error || !data) return null
  return rowToUser(data as UsuarioRow)
}

// ── Crear usuario ───────────────────────────────────────────────────
export async function createUser(params: {
  username: string
  password: string
  name: string
  email?: string
  role: "admin" | "member"
  apodo?: string
}): Promise<AppUser> {
  const supabase = createAdminClient()
  const password_hash = await bcrypt.hash(params.password, 10)

  const { data, error } = await supabase
    .from("usuarios")
    .insert({
      username: params.username,
      password_hash,
      name: params.name,
      email: params.email || null,
      role: params.role,
      apodo: params.apodo || null,
    })
    .select("id, username, name, email, role, apodo")
    .single()

  if (error) throw new Error(error.message)
  return rowToUser(data as UsuarioRow)
}

// ── Actualizar usuario (sin cambiar contraseña) ─────────────────────
export async function updateUser(
  id: string,
  params: {
    name?: string
    email?: string | null
    role?: "admin" | "member"
    apodo?: string | null
    password?: string // opcional: si viene, se hashea
  }
): Promise<AppUser> {
  const supabase = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  if (params.name     !== undefined) updates.name    = params.name
  if (params.email    !== undefined) updates.email   = params.email
  if (params.role     !== undefined) updates.role    = params.role
  if (params.apodo    !== undefined) updates.apodo   = params.apodo
  if (params.password)               updates.password_hash = await bcrypt.hash(params.password, 10)

  const { data, error } = await supabase
    .from("usuarios")
    .update(updates)
    .eq("id", id)
    .select("id, username, name, email, role, apodo")
    .single()

  if (error) throw new Error(error.message)
  return rowToUser(data as UsuarioRow)
}

// ── Eliminar usuario ────────────────────────────────────────────────
export async function deleteUser(id: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from("usuarios").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
