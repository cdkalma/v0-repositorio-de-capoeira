import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSession } from "@/lib/auth/session"

type Params = { params: Promise<{ id: string }> }

// PUT /api/politica/[id] — actualizar documento
export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { title, content, category, file_url, file_name } = body

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("politica")
      .update({
        title,
        content: content || null,
        category: category || null,
        file_url: file_url || null,
        file_name: file_name || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar el documento"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/politica/[id] — eliminar documento
export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { id } = await params

  try {
    const supabase = createAdminClient()

    // Obtener el documento para borrar el archivo de storage si existe
    const { data: doc } = await supabase
      .from("politica")
      .select("file_url")
      .eq("id", id)
      .single()

    if (doc?.file_url) {
      // Extraer el path del archivo desde la URL pública
      const url = new URL(doc.file_url)
      const pathParts = url.pathname.split("/storage/v1/object/public/politica/")
      if (pathParts[1]) {
        await supabase.storage.from("politica").remove([pathParts[1]])
      }
    }

    const { error } = await supabase.from("politica").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al eliminar el documento"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
