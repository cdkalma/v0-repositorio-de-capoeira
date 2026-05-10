"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Video, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoUploadProps {
  bucket: "videos" | "thumbnails" | "audio"
  onUploadComplete: (url: string) => void
  accept?: string
  maxSizeMB?: number
  className?: string
}

export function VideoUpload({ 
  bucket, 
  onUploadComplete, 
  accept = "video/mp4,video/webm,video/ogg",
  maxSizeMB = 500,
  className 
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB.`)
      return
    }

    setUploading(true)
    setError(null)
    setFileName(file.name)
    setProgress(0)
    setCompleted(false)

    try {
      const supabase = createClient()
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload file
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(uniqueName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      setProgress(100)
      setCompleted(true)
      onUploadComplete(publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir el archivo")
      setUploading(false)
    }
  }

  const handleReset = () => {
    setUploading(false)
    setProgress(0)
    setError(null)
    setFileName(null)
    setCompleted(false)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />

      {!uploading && !completed ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-foreground font-medium mb-2">
            Haz clic para subir o arrastra un archivo
          </p>
          <p className="text-sm text-muted-foreground">
            {bucket === "videos" ? "MP4, WebM, OGG" : 
             bucket === "thumbnails" ? "JPG, PNG, WebP" : 
             "MP3, OGG, WAV"} (máx. {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-4">
            {completed ? (
              <CheckCircle className="w-10 h-10 text-green-500 shrink-0" />
            ) : (
              <Video className="w-10 h-10 text-primary shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-medium truncate">{fileName}</p>
              {!completed && (
                <Progress value={progress} className="mt-2 h-2" />
              )}
              {completed && (
                <p className="text-sm text-green-500 mt-1">Subido correctamente</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
