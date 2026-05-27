"use client"

import { useAuth } from "@/hooks/use-auth"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Award, Loader2, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const ROLE_LABELS: Record<string, string> = {
  admin:  "Administrador",
  member: "Miembro",
}

export default function PerfilPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [apodo, setApodo] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login")
    if (user) setApodo(user.apodo ?? "")
  }, [user, loading, router])

  const handleSaveApodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setSaved(false)
    setError("")

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apodo: apodo.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al guardar")
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Info card */}
          <Card className="border-border bg-card">
            <CardHeader className="text-center border-b border-border pb-6">
              <div className="mx-auto mb-4">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="font-serif text-2xl text-foreground">
                {user.name}
                {user.apodo && (
                  <span className="block text-lg text-muted-foreground font-normal italic mt-1">
                    «{user.apodo}»
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase text-xs tracking-wide">
                    Usuario
                  </p>
                  <p className="text-foreground">@{user.username}</p>
                </div>
                {user.email && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-medium uppercase text-xs tracking-wide">
                      Email
                    </p>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Edit apodo */}
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="font-serif text-lg text-foreground">
                Editar apodo
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Tu apodo o nombre de capoeira aparecerá en tu perfil.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveApodo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apodo">Apodo (opcional)</Label>
                  <Input
                    id="apodo"
                    value={apodo}
                    onChange={(e) => setApodo(e.target.value)}
                    disabled={saving}
                    placeholder="Ej: Mariposa do Mar"
                    maxLength={60}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md py-2 px-3">
                    {error}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" />Guardando...</>
                    ) : "Guardar apodo"}
                  </Button>
                  {saved && (
                    <span className="flex items-center gap-1 text-sm text-primary">
                      <CheckCircle className="w-4 h-4" />
                      ¡Guardado!
                    </span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  )
}
