import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSession } from "@/lib/auth/session"

// GET /api/politica — listar documentos
export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("politica")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data ?? [])
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al obtener documentos"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/politica — crear documento (solo admin)
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const body = await request.json()
  const { title, content, category, file_url, file_name } = body

  if (!title) {
    return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("politica")
      .insert({
        title,
        content: content || null,
        category: category || null,
        file_url: file_url || null,
        file_name: file_name || null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al crear el documento"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
