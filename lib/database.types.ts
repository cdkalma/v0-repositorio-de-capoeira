export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  apelido: string | null
  corda: string | null
  role: 'member' | 'instructor' | 'mestre' | 'admin'
  bio: string | null
  created_at: string
  updated_at: string
}

export type Roda = {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  location: string | null
  event_date: string | null
  duration: number | null
  participants: string[] | null
  tags: string[] | null
  views: number
  user_id: string
  created_at: string
  updated_at: string
}

export type Movement = {
  id: string
  name: string
  portuguese_name: string | null
  description: string | null
  video_url: string | null
  thumbnail_url: string | null
  category: 'basico' | 'patada' | 'esquiva' | 'acrobacia' | 'floreio' | 'rasteira'
  difficulty: 'iniciante' | 'intermediario' | 'avancado'
  tips: string[] | null
  related_movements: string[] | null
  user_id: string
  created_at: string
  updated_at: string
}

export type PortugueseLesson = {
  id: string
  title: string
  description: string | null
  content: string
  level: 'basico' | 'intermediario' | 'avancado'
  category: 'saludos' | 'numeros' | 'capoeira' | 'conversacion' | 'musica' | 'cultura'
  order_index: number
  user_id: string
  created_at: string
  updated_at: string
}

export type PortugueseVocabulary = {
  id: string
  lesson_id: string | null
  word: string
  translation: string
  pronunciation: string | null
  example_sentence: string | null
  example_translation: string | null
  audio_url: string | null
  created_at: string
}

export type UserLessonProgress = {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score: number | null
  completed_at: string | null
}

export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  category: 'historia' | 'estilos' | 'musica' | 'mestres' | 'tecnicas' | 'cultura' | 'eventos'
  tags: string[] | null
  published: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export type Song = {
  id: string
  title: string
  type: 'ladainha' | 'corrido' | 'quadra' | 'chula' | 'samba'
  lyrics: string
  translation: string | null
  context: string | null
  video_url: string | null
  audio_url: string | null
  mestre: string | null
  tags: string[] | null
  user_id: string
  created_at: string
  updated_at: string
}

export type Comment = {
  id: string
  content: string
  user_id: string
  roda_id: string | null
  article_id: string | null
  song_id: string | null
  created_at: string
  updated_at: string
}

export type Favorite = {
  id: string
  user_id: string
  roda_id: string | null
  movement_id: string | null
  article_id: string | null
  song_id: string | null
  created_at: string
}
