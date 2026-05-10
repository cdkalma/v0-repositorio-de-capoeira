"use client"

import { useState } from "react"
import { Play, Clock, Calendar, MapPin, Users, X } from "lucide-react"

interface VideoCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  date: string
  location: string
  participants: number
  videoUrl: string
}

export function VideoCard({
  title,
  description,
  duration,
  date,
  location,
  participants,
  videoUrl,
}: VideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <article 
        className="group bg-card rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02]"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-secondary overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/80 to-transparent">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-primary-foreground ml-1" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/90 rounded text-xs font-medium text-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-serif text-lg font-bold text-card-foreground mb-2 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {participants}
            </span>
          </div>
        </div>
      </article>

      {/* Video Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video bg-card rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Cerrar video"
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
            />
          </div>
        </div>
      )}
    </>
  )
}
