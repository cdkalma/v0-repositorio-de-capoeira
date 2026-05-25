import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSession } from "@/lib/auth/session"

type Params = { params: Promise<{ id: string }> }

// PUT /api/rodas/[id] — actualizar roda
export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { title, description, video_url, location, event_date } = body

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("rodas")
      .update({
        title,
        description: description || null,
        video_url,
        location: location || null,
        event_date: event_date || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar la roda"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/rodas/[id] — eliminar roda
export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { id } = await params

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from("rodas").delete().eq("id", id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al eliminar la roda"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
