import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSession } from "@/lib/auth/session"

// POST /api/politica/upload — subir archivo a Supabase Storage (solo admin)
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

    // Validar tamaño (máx 20 MB)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo no puede superar 20 MB" }, { status: 400 })
    }

    // Sanitizar nombre del archivo
    const ext = file.name.split(".").pop() ?? ""
    const safeName = file.name
      .replace(/\.[^/.]+$/, "") // quitar extensión
      .replace(/[^a-zA-Z0-9_-]/g, "_") // solo alfanumérico
      .slice(0, 60)
    const fileName = `${Date.now()}_${safeName}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const supabase = createAdminClient()
    const { error: uploadError } = await supabase.storage
      .from("politica")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabase.storage.from("politica").getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl, name: file.name })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al subir el archivo"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
