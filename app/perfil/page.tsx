"use client"

import { useAuth } from "@/hooks/use-auth"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Award, Edit2, Save, X } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Profile } from "@/lib/database.types"
import { useRouter } from "next/navigation"

export default function PerfilPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    apelido: "",
    corda: "",
    bio: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      
      const supabase = createClient()
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      
      if (data) {
        setProfile(data as Profile)
        setFormData({
          full_name: data.full_name || "",
          apelido: data.apelido || "",
          corda: data.corda || "",
          bio: data.bio || "",
        })
      }
    }

    fetchProfile()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        apelido: formData.apelido,
        corda: formData.corda,
        bio: formData.bio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
    
    if (!error) {
      setProfile(prev => prev ? { ...prev, ...formData } : null)
      setEditing(false)
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-border bg-card">
            <CardHeader className="text-center border-b border-border pb-6">
              <div className="mx-auto mb-4">
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full border-4 border-primary"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-12 h-12 text-primary-foreground" />
                  </div>
                )}
              </div>
              <CardTitle className="font-serif text-2xl text-foreground">
                {profile?.full_name || user.user_metadata?.full_name || "Capoeirista"}
              </CardTitle>
              <CardDescription className="text-muted-foreground flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </CardDescription>
              {profile?.corda && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">{profile.corda}</span>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="flex justify-end mb-6">
                {editing ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => setEditing(false)}
                      disabled={saving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditing(true)}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar perfil
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-foreground">Nombre completo</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      disabled={!editing}
                      className="bg-input border-border text-foreground"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apelido" className="text-foreground">Apelido (apodo de capoeira)</Label>
                    <Input
                      id="apelido"
                      value={formData.apelido}
                      onChange={(e) => setFormData(prev => ({ ...prev, apelido: e.target.value }))}
                      disabled={!editing}
                      className="bg-input border-border text-foreground"
                      placeholder="Tu apelido"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corda" className="text-foreground">Corda (nivel)</Label>
                  <Input
                    id="corda"
                    value={formData.corda}
                    onChange={(e) => setFormData(prev => ({ ...prev, corda: e.target.value }))}
                    disabled={!editing}
                    className="bg-input border-border text-foreground"
                    placeholder="Ej: Corda Verde, Corda Amarela..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-foreground">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!editing}
                    className="bg-input border-border text-foreground min-h-32"
                    placeholder="Cuéntanos sobre ti y tu historia en la capoeira..."
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Rol:</strong>{" "}
                    {profile?.role === "admin" ? "Administrador" :
                     profile?.role === "mestre" ? "Mestre" :
                     profile?.role === "instructor" ? "Instructor" : "Miembro"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong className="text-foreground">Miembro desde:</strong>{" "}
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    }) : "—"}
                  </p>
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
