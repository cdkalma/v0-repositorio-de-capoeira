"use client"

import { useState } from "react"
import { SectionLayout } from "@/components/section-layout"
import { SongCard } from "@/components/song-card"
import { Music, Filter } from "lucide-react"

const songTypes = [
  { id: "all", label: "Todas" },
  { id: "ladainha", label: "Ladainhas" },
  { id: "corrido", label: "Corridos" },
  { id: "quadra", label: "Quadras" },
  { id: "chula", label: "Chulas" },
]

const songs = [
  {
    id: "1",
    title: "Paranauê",
    type: "corrido",
    lyrics: `Paranauê, paranauê, Paraná
Paranauê, paranauê, Paraná

Vou dizer a meu senhor
Que a manteiga derramou
A manteiga não é minha
A manteiga é de Ioiô

Paranauê, paranauê, Paraná
Paranauê, paranauê, Paraná`,
    translation: `Paranauê, paranauê, Paraná
Paranauê, paranauê, Paraná

Voy a decirle a mi señor
Que la mantequilla se derramó
La mantequilla no es mía
La mantequilla es del amo

Paranauê, paranauê, Paraná
Paranauê, paranauê, Paraná`,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    history: "Una de las canciones más populares de capoeira, con origen en las senzalas. El término 'Paranauê' puede referirse al río Paraná o ser una expresión rítmica africana.",
  },
  {
    id: "2",
    title: "Zum Zum Zum",
    type: "corrido",
    lyrics: `Zum zum zum, capoeira mata um
Zum zum zum, capoeira mata um

Na roda da capoeira
Zum zum zum, capoeira mata um

O mestre é quem comanda
Zum zum zum, capoeira mata um`,
    translation: `Zum zum zum, capoeira mata uno
Zum zum zum, capoeira mata uno

En la roda de capoeira
Zum zum zum, capoeira mata uno

El maestro es quien comanda
Zum zum zum, capoeira mata uno`,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    history: "El 'zum zum' imita el sonido del berimbau. Esta canción recuerda el poder de la capoeira como arte de defensa.",
  },
  {
    id: "3",
    title: "Iê, Volta do Mundo",
    type: "chula",
    lyrics: `Iê, volta do mundo, camará
Iê, volta do mundo, camará
Iê, que o mundo deu, camará
Iê, o mundo dá, camará
Iê, vamos embora, camará
Iê, pelo mundo afora, camará`,
    translation: `Iê, vuelta del mundo, camarada
Iê, vuelta del mundo, camarada
Iê, que el mundo dio, camarada
Iê, el mundo da, camarada
Iê, vámonos, camarada
Iê, por el mundo afuera, camarada`,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    history: "La 'volta do mundo' es un ritual donde los jugadores caminan alrededor de la roda. Esta chula marca ese momento ceremonial.",
  },
  {
    id: "4",
    title: "Maior é Deus",
    type: "ladainha",
    lyrics: `Iê!
Maior é Deus, pequeno sou eu
O que eu tenho foi Deus quem me deu
O que eu tenho foi Deus quem me deu
Na roda de capoeira, grande pequeno sou eu

Iê, viva meu Deus!
Iê, viva meu Mestre!
Iê, quem me ensinou!
Iê, a malandragem!
Iê, da capoeira!
Iê, volta do mundo!
Iê, que o mundo deu!`,
    translation: `Iê!
Más grande es Dios, pequeño soy yo
Lo que tengo fue Dios quien me lo dio
Lo que tengo fue Dios quien me lo dio
En la roda de capoeira, grande y pequeño soy yo

Iê, viva mi Dios!
Iê, viva mi Maestro!
Iê, quien me enseñó!
Iê, la malicia!
Iê, de la capoeira!
Iê, vuelta del mundo!
Iê, que el mundo dio!`,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    history: "Una ladainha tradicional que expresa humildad ante lo divino y gratitud hacia los maestros. Se canta al inicio de la roda.",
  },
  {
    id: "5",
    title: "Dona Maria",
    type: "corrido",
    lyrics: `Ê, Dona Maria, como vai você?
Ê, Dona Maria, como vai você?
Eu vou bem, eu vou bem
Eu vou bem, obrigado, e você?

Ê, Dona Maria, como vai você?
A capoeira me chamou
E eu vim aqui jogar`,
    translation: `Ê, Doña María, ¿cómo está usted?
Ê, Doña María, ¿cómo está usted?
Yo estoy bien, yo estoy bien
Yo estoy bien, gracias, ¿y usted?

Ê, Doña María, ¿cómo está usted?
La capoeira me llamó
Y yo vine aquí a jugar`,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    history: "Un corrido alegre que representa el espíritu social de la capoeira. Dona Maria es un nombre genérico para referirse a las mujeres del pueblo.",
  },
  {
    id: "6",
    title: "A Manteiga Derramou",
    type: "quadra",
    lyrics: `A manteiga derramou
Quero ver quem vai pagar
A manteiga não é minha
A manteiga é de Ioiô

A manteiga derramou
Quero ver quem vai pagar`,
    translation: `La mantequilla se derramó
Quiero ver quién va a pagar
La mantequilla no es mía
La mantequilla es del amo

La mantequilla se derramó
Quiero ver quién va a pagar`,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    history: "Quadra que habla de la época de la esclavitud. La mantequilla representa los bienes del amo (Ioiô), y el esclavo no quería ser culpado por la pérdida.",
  },
]

export default function CancionesPage() {
  const [selectedType, setSelectedType] = useState("all")

  const filteredSongs = songs.filter(
    (song) => selectedType === "all" || song.type === selectedType
  )

  return (
    <SectionLayout
      title="Canciones"
      description="Letras, traducciones y videos de las canciones tradicionales de capoeira. Aprende la música que da vida a la roda."
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
            <span className="text-muted-foreground"> Canto inicial solista, cuenta historias o rinde homenajes.</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Chula:</span>
            <span className="text-muted-foreground"> Respuesta coral a la ladainha, con llamadas y respuestas.</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Corrido:</span>
            <span className="text-muted-foreground"> Cantos rápidos durante el juego, marcan el ritmo.</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Quadra:</span>
            <span className="text-muted-foreground"> Estrofas de cuatro versos, narrativas cortas.</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-muted-foreground shrink-0" />
        {songTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedType === type.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Songs List */}
      <div className="space-y-6">
        {filteredSongs.map((song) => (
          <SongCard key={song.id} {...song} />
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No se encontraron canciones de este tipo.</p>
        </div>
      )}
    </SectionLayout>
  )
}
