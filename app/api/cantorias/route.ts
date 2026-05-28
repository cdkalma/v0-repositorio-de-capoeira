import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSession } from "@/lib/auth/session"

// GET /api/cantorias
export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("cantorias")
      .select("*")
      .order("event_date", { ascending: false, nullsFirst: false })

    if (error) throw error
    return NextResponse.json(data ?? [])
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al obtener cantorias"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/cantorias (solo admin)
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (session.user.role !== "admin") return NextResponse.json({ error: "Sin permisos" }, { status: 403 })

  const body = await request.json()
  const { title, video_url, description, event_date } = body

  if (!title) {
    return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("cantorias")
      .insert({
        title,
        video_url: video_url || null,
        description: description || null,
        event_date: event_date || null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al crear cantoria"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
