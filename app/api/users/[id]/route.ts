import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { updateUser, deleteUser } from "@/lib/auth/db"

type Params = { params: Promise<{ id: string }> }

// PUT /api/users/[id] — actualizar usuario
// Admin: puede cambiar cualquier campo de cualquier usuario
// El propio usuario: solo puede cambiar su apodo
export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const { id } = await params
  const isAdmin = session.user.role === "admin"
  const isSelf  = session.user.id === id

  if (!isAdmin && !isSelf) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const body = await request.json()

  try {
    // Miembros solo pueden editar su propio apodo
    const updates = isAdmin
      ? {
          name:     body.name,
          email:    body.email,
          role:     body.role,
          apodo:    body.apodo,
          password: body.password || undefined,
        }
      : { apodo: body.apodo } // members: solo apodo

    const user = await updateUser(id, updates)

    // Si el usuario editó su propio perfil, actualizar la sesión
    if (isSelf) {
      session.user = { ...session.user, ...user }
      await session.save()
    }

    return NextResponse.json(user)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar usuario"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/users/[id] — eliminar usuario (solo admin)
export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (session.user.role !== "admin") return NextResponse.json({ error: "Sin permisos" }, { status: 403 })

  const { id } = await params

  // No puede eliminarse a sí mismo
  if (session.user.id === id) {
    return NextResponse.json({ error: "No puedes eliminarte a ti mismo" }, { status: 400 })
  }

  try {
    await deleteUser(id)
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al eliminar usuario"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
