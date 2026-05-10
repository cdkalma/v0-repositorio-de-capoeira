import { createClient } from "@/lib/supabase/client"

export type StorageBucket = "videos" | "thumbnails" | "avatars" | "audio"

export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  folder?: string
): Promise<{ url: string; path: string } | { error: string }> {
  const supabase = createClient()
  
  const fileExt = file.name.split('.').pop()
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const path = folder ? `${folder}/${uniqueName}` : uniqueName

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return { url: publicUrl, path: data.path }
}

export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const supabase = createClient()
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return publicUrl
}

export async function listFiles(
  bucket: StorageBucket,
  folder?: string
): Promise<{ files: { name: string; url: string }[]; error?: string }> {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder || undefined, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    })

  if (error) {
    return { files: [], error: error.message }
  }

  const files = data
    .filter(file => file.name !== '.emptyFolderPlaceholder')
    .map(file => ({
      name: file.name,
      url: getPublicUrl(bucket, folder ? `${folder}/${file.name}` : file.name)
    }))

  return { files }
}
