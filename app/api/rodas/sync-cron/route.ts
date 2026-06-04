import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getYouTubeId } from "@/lib/utils/video-url"

// Vercel Cron llama con GET y adjunta:
//   Authorization: Bearer {CRON_SECRET}
// Definir CRON_SECRET en las env vars de Vercel.

interface YTThumbnail { url: string }
interface YTSnippet {
  title: string
  description: string
  publishedAt: string
  thumbnails: { default?: YTThumbnail; medium?: YTThumbnail; high?: YTThumbnail }
  resourceId: { videoId: string }
}
interface YTPlaylistItem { snippet: YTSnippet }
interface YTPlaylistResponse { nextPageToken?: string; items: YTPlaylistItem[]; error?: { message: string } }

async function runSync(): Promise<{ inserted: number; skipped: number }> {
  const apiKey     = process.env.YOUTUBE_API_KEY
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID
  if (!apiKey || !playlistId) throw new Error("Missing YOUTUBE_API_KEY or YOUTUBE_PLAYLIST_ID")

  const supabase = createAdminClient()
  const { data: existingRows } = await supabase.from("rodas").select("video_url")

  const knownIds = new Set<string>()
  for (const row of existingRows ?? []) {
    const id = getYouTubeId(row.video_url)
    if (id) knownIds.add(id)
  }

  const items: YTPlaylistItem[] = []
  let pageToken: string | undefined

  do {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems")
    url.searchParams.set("part", "snippet")
    url.searchParams.set("playlistId", playlistId)
    url.searchParams.set("maxResults", "50")
    url.searchParams.set("key", apiKey)
    if (pageToken) url.searchParams.set("pageToken", pageToken)

    const res = await fetch(url.toString())
    const json: YTPlaylistResponse = await res.json()
    if (json.error) throw new Error(json.error.message)
    items.push(...(json.items ?? []))
    pageToken = json.nextPageToken
  } while (pageToken)

  const newRows = items
    .filter((item) => {
      const vid = item.snippet.resourceId.videoId
      return vid && !knownIds.has(vid) && Object.keys(item.snippet.thumbnails).length > 0
    })
    .map((item) => ({
      title:         item.snippet.title,
      description:   item.snippet.description?.slice(0, 500) || null,
      video_url:     `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      thumbnail_url: item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.medium?.url ?? null,
      event_date:    item.snippet.publishedAt.slice(0, 10),
      views:         0,
    }))

  if (newRows.length > 0) {
    const { error } = await supabase.from("rodas").insert(newRows)
    if (error) throw new Error(error.message)
  }

  return { inserted: newRows.length, skipped: items.length - newRows.length }
}

// GET /api/rodas/sync-cron — Vercel Cron endpoint
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const result = await runSync()
    return NextResponse.json({ ok: true, ...result })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error en cron sync"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
