"use client"

import { useAuth } from "@/hooks/use-auth"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Award } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  mestre: "Mestre",
  instructor: "Instructor",
  member: "Miembro",
}

export default function PerfilPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-border bg-card">
            <CardHeader className="text-center border-b border-border pb-6">
              <div className="mx-auto mb-4">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="font-serif text-2xl text-foreground">
                {user.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </CardDescription>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase text-xs tracking-wide">
                    Usuario
                  </p>
                  <p className="text-foreground">{user.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase text-xs tracking-wide">
                    Rol
                  </p>
                  <p className="text-foreground">{ROLE_LABELS[user.role] ?? user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
