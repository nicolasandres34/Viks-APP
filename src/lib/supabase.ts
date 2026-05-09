import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase. Crea un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  nombre: string
  role: 'admin' | 'usuario'
  created_at: string
}

export type Acceso = {
  id: number
  user_id: string
  tipo: 'entrada' | 'salida'
  timestamp: string
  notas: string | null
}

export type AccesoConPerfil = Acceso & {
  profiles: { nombre: string }
}
