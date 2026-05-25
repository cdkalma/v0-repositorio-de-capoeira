import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSession } from "@/lib/auth/session"

// GET /api/songs — listar canciones
export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data ?? [])
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al obtener canciones"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/songs — crear canción (requiere sesión)
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const body = await request.json()
  const { title, type, lyrics, translation, context, video_url, mestre } = body

  if (!title || !type || !lyrics) {
    return NextResponse.json(
      { error: "Título, tipo y letra son obligatorios" },
      { status: 400 }
    )
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("songs")
      .insert({
        title,
        type,
        lyrics,
        translation: translation || null,
        context: context || null,
        video_url: video_url || null,
        mestre: mestre || null,
        // user_id: Si la columna es obligatoria con FK a auth.users,
        // debes hacer esa columna nullable en Supabase Dashboard.
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al crear la canción"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
