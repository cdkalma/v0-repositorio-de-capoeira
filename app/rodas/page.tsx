import { SectionLayout } from "@/components/section-layout"
import { VideoCard } from "@/components/video-card"
import { Play, Calendar, MapPin, Users } from "lucide-react"

const rodas = [
  {
    id: "1",
    title: "Roda de Verano 2024",
    description: "Gran encuentro de verano con maestros invitados de Brasil. Una tarde inolvidable de capoeira angola y regional.",
    thumbnail: "/api/placeholder/640/360",
    duration: "45:30",
    date: "15 de Julio, 2024",
    location: "Parque Central",
    participants: 28,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "2",
    title: "Batizado Anual",
    description: "Ceremonia de bautizo y cambio de cordas. Momento especial donde los alumnos reciben sus nuevas graduaciones.",
    thumbnail: "/api/placeholder/640/360",
    duration: "1:23:45",
    date: "20 de Marzo, 2024",
    location: "Centro Cultural",
    participants: 45,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "3",
    title: "Roda en la Playa",
    description: "Sesión especial al atardecer con el sonido del mar de fondo. Capoeira en su forma más libre y natural.",
    thumbnail: "/api/placeholder/640/360",
    duration: "38:15",
    date: "5 de Agosto, 2024",
    location: "Playa del Sol",
    participants: 18,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "4",
    title: "Encuentro Internacional",
    description: "Capoeiristas de diferentes países se reúnen para compartir estilos y experiencias únicas.",
    thumbnail: "/api/placeholder/640/360",
    duration: "2:15:00",
    date: "10 de Octubre, 2024",
    location: "Gimnasio Municipal",
    participants: 62,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "5",
    title: "Roda de Año Nuevo",
    description: "Celebración especial para recibir el nuevo año con energía positiva y mucho axé.",
    thumbnail: "/api/placeholder/640/360",
    duration: "52:20",
    date: "1 de Enero, 2024",
    location: "Plaza Mayor",
    participants: 35,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "6",
    title: "Clase Magistral con Mestre João",
    description: "Sesión especial de entrenamiento con uno de los mestres más reconocidos de capoeira angola.",
    thumbnail: "/api/placeholder/640/360",
    duration: "1:45:00",
    date: "28 de Febrero, 2024",
    location: "Academia Central",
    participants: 25,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
]

export default function RodasPage() {
  return (
    <SectionLayout
      title="Rodas"
      description="Videos de nuestras rodas, encuentros y eventos especiales. Revive los mejores momentos de nuestra comunidad."
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
          <p className="text-3xl font-bold text-foreground">2024</p>
          <p className="text-sm text-muted-foreground">Año Activo</p>
        </div>
        <div className="bg-card rounded-xl p-6 text-center">
          <MapPin className="w-8 h-8 text-chart-3 mx-auto mb-2" />
          <p className="text-3xl font-bold text-foreground">6</p>
          <p className="text-sm text-muted-foreground">Ubicaciones</p>
        </div>
        <div className="bg-card rounded-xl p-6 text-center">
          <Users className="w-8 h-8 text-chart-4 mx-auto mb-2" />
          <p className="text-3xl font-bold text-foreground">213</p>
          <p className="text-sm text-muted-foreground">Participantes</p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rodas.map((roda) => (
          <VideoCard key={roda.id} {...roda} />
        ))}
      </div>
    </SectionLayout>
  )
}
