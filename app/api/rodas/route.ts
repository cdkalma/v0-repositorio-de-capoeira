import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSession } from "@/lib/auth/session"

// GET /api/rodas — listar rodas
export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("rodas")
      .select("*")
      .order("event_date", { ascending: false, nullsFirst: false })

    if (error) throw error
    return NextResponse.json(data ?? [])
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al obtener rodas"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/rodas — crear roda (solo admin)
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const body = await request.json()
  const { title, description, video_url, location, event_date } = body

  if (!title || !video_url) {
    return NextResponse.json(
      { error: "Título y URL de video son obligatorios" },
      { status: 400 }
    )
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("rodas")
      .insert({
        title,
        description: description || null,
        video_url,
        location: location || null,
        event_date: event_date || null,
        views: 0,
        // user_id: Si la columna es obligatoria con FK a auth.users,
        // debes hacerla nullable en Supabase Dashboard.
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al crear la roda"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
