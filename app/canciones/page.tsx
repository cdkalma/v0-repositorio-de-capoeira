"use client"

import { useEffect, useState, useCallback } from "react"
import { SectionLayout } from "@/components/section-layout"
import { SongCard } from "@/components/song-card"
import { Music, Filter, Plus, Loader2 } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Song {
  id: string
  title: string
  type: string
  lyrics: string
  translation: string | null
  context: string | null
  video_url: string | null
  mestre: string | null
  created_at: string
}

const songTypes = [
  { id: "all", label: "Todas" },
  { id: "ladainha", label: "Ladainhas" },
  { id: "corrido", label: "Corridos" },
  { id: "quadra", label: "Quadras" },
  { id: "chula", label: "Chulas" },
  { id: "samba", label: "Sambas" },
]

const EMPTY_FORM = {
  title: "",
  type: "corrido",
  lyrics: "",
  translation: "",
  context: "",
  video_url: "",
  mestre: "",
}

export default function CancionesPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")

  // ── Fetch ─────────────────────────────────────────────────────────
  const fetchSongs = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/songs")
      if (!res.ok) throw new Error("Error al cargar canciones")
      const data = await res.json()
      setSongs(data)
    } catch {
      setError("No se pudieron cargar las canciones. Revisa la conexión a Supabase.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSongs() }, [fetchSongs])

  // ── Dialog helpers ─────────────────────────────────────────────────
  const openAdd = () => {
    setEditingSong(null)
    setForm(EMPTY_FORM)
    setFormError("")
    setDialogOpen(true)
  }

  const openEdit = (song: Song) => {
    setEditingSong(song)
    setForm({
      title: song.title,
      type: song.type,
      lyrics: song.lyrics,
      translation: song.translation ?? "",
      context: song.context ?? "",
      video_url: song.video_url ?? "",
      mestre: song.mestre ?? "",
    })
    setFormError("")
    setDialogOpen(true)
  }

  // ── Save (create / update) ─────────────────────────────────────────
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")
    setSaving(true)

    const url = editingSong ? `/api/songs/${editingSong.id}` : "/api/songs"
    const method = editingSong ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? "Error al guardar")

      await fetchSongs()
      setDialogOpen(false)
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta canción?")) return
    try {
      const res = await fetch(`/api/songs/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error al eliminar")
      setSongs((prev) => prev.filter((s) => s.id !== id))
    } catch {
      alert("No se pudo eliminar la canción.")
    }
  }

  // ── Filter ────────────────────────────────────────────────────────
  const filteredSongs =
    selectedType === "all" ? songs : songs.filter((s) => s.type === selectedType)

  return (
    <SectionLayout
      title="Canciones"
      description="Letras, traducciones y videos de las canciones de capoeira de nuestro grupo."
    >
      {/* Song Types Info */}
      <div className="bg-card rounded-xl p-6 mb-8">
        <h3 className="font-serif font-bold text-foreground mb-4 flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          Tipos de Canciones
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-foreground">Ladainha:</span>
            <span className="text-muted-foreground"> Canto inicial solista.</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Chula:</span>
            <span className="text-muted-foreground"> Respuesta coral a la ladainha.</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Corrido:</span>
            <span className="text-muted-foreground"> Cantos rápidos durante el juego.</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Quadra:</span>
            <span className="text-muted-foreground"> Estrofas de cuatro versos.</span>
          </div>
        </div>
      </div>

      {/* Filter + Add button */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <Filter className="w-5 h-5 text-muted-foreground shrink-0" />
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          {songTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedType === t.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button onClick={openAdd} className="shrink-0 gap-2">
          <Plus className="w-4 h-4" />
          Nueva canción
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
          <Button variant="outline" className="mt-4" onClick={fetchSongs}>
            Reintentar
          </Button>
        </div>
      )}

      {!loading && !error && filteredSongs.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            {songs.length === 0
              ? "Aún no hay canciones. ¡Agrega la primera!"
              : "No hay canciones de este tipo."}
          </p>
        </div>
      )}

      {/* Songs List */}
      {!loading && !error && (
        <div className="space-y-6">
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              id={song.id}
              title={song.title}
              type={song.type}
              lyrics={song.lyrics}
              translation={song.translation ?? ""}
              history={song.context ?? ""}
              videoUrl={song.video_url ?? ""}
              mestre={song.mestre ?? ""}
              onEdit={() => openEdit(song)}
              onDelete={() => handleDelete(song.id)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingSong ? "Editar canción" : "Nueva canción"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-5 mt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  disabled={saving}
                  placeholder="Ej: Paranauê"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}
                  disabled={saving}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ladainha">Ladainha</SelectItem>
                    <SelectItem value="corrido">Corrido</SelectItem>
                    <SelectItem value="quadra">Quadra</SelectItem>
                    <SelectItem value="chula">Chula</SelectItem>
                    <SelectItem value="samba">Samba</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mestre">Mestre / Autor (opcional)</Label>
              <Input
                id="mestre"
                value={form.mestre}
                onChange={(e) => setForm((f) => ({ ...f, mestre: e.target.value }))}
                disabled={saving}
                placeholder="Ej: Mestre Pastinha"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lyrics">Letra *</Label>
              <Textarea
                id="lyrics"
                value={form.lyrics}
                onChange={(e) => setForm((f) => ({ ...f, lyrics: e.target.value }))}
                required
                disabled={saving}
                rows={5}
                placeholder="Letra en portugués..."
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="translation">Traducción (opcional)</Label>
              <Textarea
                id="translation"
                value={form.translation}
                onChange={(e) => setForm((f) => ({ ...f, translation: e.target.value }))}
                disabled={saving}
                rows={5}
                placeholder="Traducción al español..."
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Historia / Contexto (opcional)</Label>
              <Textarea
                id="context"
                value={form.context}
                onChange={(e) => setForm((f) => ({ ...f, context: e.target.value }))}
                disabled={saving}
                rows={3}
                placeholder="Origen, historia o contexto de la canción..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_url">URL de video YouTube (opcional)</Label>
              <Input
                id="video_url"
                type="url"
                value={form.video_url}
                onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                disabled={saving}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            {formError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md py-2 px-3">
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Guardando...</>
                ) : editingSong ? "Guardar cambios" : "Agregar canción"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </SectionLayout>
  )
}
