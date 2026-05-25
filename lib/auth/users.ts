/**
 * Lista de usuarios del sistema.
 * Para añadir un nuevo usuario, agrega una entrada en USERS y en CREDENTIALS.
 *
 * Usuario de prueba: test / capoeira2024
 */

export interface AppUser {
  id: string
  username: string
  name: string
  email: string
  role: "member" | "instructor" | "mestre" | "admin"
}

// Credenciales: { usuario: contraseña }
// Puedes mover las contraseñas a variables de entorno si lo prefieres.
const CREDENTIALS: Record<string, string> = {
  test: "capoeira2024",
  // admin: "tu-contraseña-aqui",
}

// Información de cada usuario
const USERS: Record<string, AppUser> = {
  test: {
    id: "1",
    username: "test",
    name: "Usuario Test",
    email: "test@gaiacapoeira.com",
    role: "member",
  },
  // admin: {
  //   id: "2",
  //   username: "admin",
  //   name: "Administrador",
  //   email: "admin@gaiacapoeira.com",
  //   role: "admin",
  // },
}

/** Verifica credenciales y devuelve el usuario si son correctas. */
export function verifyCredentials(username: string, password: string): AppUser | null {
  const expectedPassword = CREDENTIALS[username]
  if (!expectedPassword) return null
  if (expectedPassword !== password) return null
  return USERS[username] ?? null
}
