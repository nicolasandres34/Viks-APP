import { useState, useCallback } from 'react'
import { supabase, Acceso, AccesoConPerfil } from '../lib/supabase'

const PAGE_SIZE = 20

export function useAccesos(userId: string) {
  const [accesos, setAccesos] = useState<Acceso[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async (pageNum = 0) => {
    setLoading(true)
    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, count, error } = await supabase
      .from('accesos')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .range(from, to)

    if (!error) {
      setAccesos(data ?? [])
      setTotal(count ?? 0)
      setPage(pageNum)
    }
    setLoading(false)
  }, [userId])

  async function registrar(tipo: 'entrada' | 'salida', notas?: string) {
    const { error } = await supabase
      .from('accesos')
      .insert({ user_id: userId, tipo, notas: notas ?? null })
    if (error) throw error
    await fetch(0)
  }

  return { accesos, total, page, loading, fetch, registrar, PAGE_SIZE }
}

export type AdminFilters = {
  userId?: string
  tipo?: 'entrada' | 'salida' | ''
  desde?: string
  hasta?: string
}

export function useAdminAccesos() {
  const [accesos, setAccesos] = useState<AccesoConPerfil[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async (filters: AdminFilters = {}, pageNum = 0) => {
    setLoading(true)
    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('accesos')
      .select('*, profiles(nombre)', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range(from, to)

    if (filters.userId) query = query.eq('user_id', filters.userId)
    if (filters.tipo) query = query.eq('tipo', filters.tipo)
    if (filters.desde) query = query.gte('timestamp', filters.desde)
    if (filters.hasta) query = query.lte('timestamp', filters.hasta + 'T23:59:59')

    const { data, count, error } = await query
    if (!error) {
      setAccesos((data as AccesoConPerfil[]) ?? [])
      setTotal(count ?? 0)
      setPage(pageNum)
    }
    setLoading(false)
  }, [])

  return { accesos, total, page, loading, fetch, PAGE_SIZE }
}
