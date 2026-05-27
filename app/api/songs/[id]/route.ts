import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSession } from "@/lib/auth/session"

type Params = { params: Promise<{ id: string }> }

// PUT /api/songs/[id] — actualizar canción (admin o member)
export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
  // Ambos roles pueden editar canciones

  const { id } = await params
  const body = await request.json()
  const { title, type, lyrics, translation, context, video_url, mestre, tags } = body

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("songs")
      .update({
        title,
        type,
        lyrics,
        translation: translation || null,
        context: context || null,
        video_url: video_url || null,
        mestre: mestre || null,
        tags: tags && tags.length > 0 ? tags : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar la canción"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/songs/[id] — eliminar canción (solo admin)
export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id } = await params

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from("songs").delete().eq("id", id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al eliminar la canción"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
