"use client"

import { useEffect, useState, useCallback } from "react"
import { SectionLayout } from "@/components/section-layout"
import { VideoCard } from "@/components/video-card"
import { Play, Calendar, MapPin, Users, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Roda {
  id: string
  title: string
  description: string | null
  video_url: string
  location: string | null
  event_date: string | null
  views: number
  created_at: string
}

const EMPTY_FORM = {
  title: "",
  description: "",
  video_url: "",
  location: "",
  event_date: "",
}

export default function RodasPage() {
  const [rodas, setRodas] = useState<Roda[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")

  // ── Fetch ─────────────────────────────────────────────────────────
  const fetchRodas = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/rodas")
      if (!res.ok) throw new Error("Error al cargar")
      const data = await res.json()
      setRodas(data)
    } catch {
      setError("No se pudieron cargar las rodas. Revisa la conexión a Supabase.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRodas() }, [fetchRodas])

  // ── Save ──────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")
    setSaving(true)

    try {
      const res = await fetch("/api/rodas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al guardar")

      await fetchRodas()
      setDialogOpen(false)
      setForm(EMPTY_FORM)
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta roda?")) return
    try {
      const res = await fetch(`/api/rodas/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setRodas((prev) => prev.filter((r) => r.id !== id))
    } catch {
      alert("No se pudo eliminar la roda.")
    }
  }

  // ── Stats ─────────────────────────────────────────────────────────
  const totalViews = rodas.reduce((acc, r) => acc + (r.views ?? 0), 0)
  const locations = new Set(rodas.map((r) => r.location).filter(Boolean)).size

  return (
    <SectionLayout
      title="Rodas"
      description="Videos de nuestras rodas, encuentros y eventos especiales."
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-card rounded-xl p-6 text-center">
          <Play className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-3xl font-bold text-foreground">{rodas.length}</p>
          <p className="text-sm text-muted-foreground">Videos</p>
        </div>
        <div className="bg-card rounded-xl p-6 text-center">
          <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
          <p className="text-3xl font-bold text-foreground">
            {rodas[0]?.event_date
              ? new Date(rodas[0].event_date).getFullYear()
              : new Date().getFullYear()}
          </p>
          <p className="text-sm text-muted-foreground">Último año</p>
        </div>
        <div className="bg-card rounded-xl p-6 text-center">
          <MapPin className="w-8 h-8 text-chart-3 mx-auto mb-2" />
          <p className="text-3xl font-bold text-foreground">{locations}</p>
          <p className="text-sm text-muted-foreground">Ubicaciones</p>
        </div>
        <div className="bg-card rounded-xl p-6 text-center">
          <Users className="w-8 h-8 text-chart-4 mx-auto mb-2" />
          <p className="text-3xl font-bold text-foreground">{totalViews}</p>
          <p className="text-sm text-muted-foreground">Reproducciones</p>
        </div>
      </div>

      {/* Add button */}
      <div className="flex justify-end mb-6">
        <Button
          onClick={() => { setForm(EMPTY_FORM); setFormError(""); setDialogOpen(true) }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar roda
        </Button>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchRodas}>
            Reintentar
          </Button>
        </div>
      )}

      {!loading && !error && rodas.length === 0 && (
        <div className="text-center py-16">
          <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            Aún no hay rodas. ¡Agrega la primera!
          </p>
        </div>
      )}

      {/* Video Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rodas.map((roda) => (
            <VideoCard
              key={roda.id}
              id={roda.id}
              title={roda.title}
              description={roda.description ?? ""}
              videoUrl={roda.video_url}
              location={roda.location ?? ""}
              eventDate={roda.event_date ?? ""}
              views={roda.views ?? 0}
              onDelete={() => handleDelete(roda.id)}
            />
          ))}
        </div>
      )}

      {/* Add Roda Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Agregar Roda</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="r-title">Título *</Label>
              <Input
                id="r-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                disabled={saving}
                placeholder="Ej: Roda de Verano 2025"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-video">
                URL del Video (YouTube / Vimeo) *
              </Label>
              <Input
                id="r-video"
                type="url"
                value={form.video_url}
                onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                required
                disabled={saving}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-muted-foreground">
                Pega el enlace normal de YouTube — se incrustará automáticamente.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-desc">Descripción (opcional)</Label>
              <Textarea
                id="r-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                disabled={saving}
                rows={3}
                placeholder="Breve descripción del evento..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="r-location">Lugar (opcional)</Label>
                <Input
                  id="r-location"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  disabled={saving}
                  placeholder="Ej: Parque Central"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-date">Fecha (opcional)</Label>
                <Input
                  id="r-date"
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                  disabled={saving}
                />
              </div>
            </div>

            {formError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md py-2 px-3">
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Guardando...</>
                  : "Agregar roda"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </SectionLayout>
  )
}
