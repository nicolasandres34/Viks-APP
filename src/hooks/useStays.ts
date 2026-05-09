import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export type Stay = {
  id: number
  user_id: string
  fecha_inicio: string
  fecha_fin: string
  notas: string | null
  created_at: string
}

export type StayWithProfile = Stay & {
  profiles: { nombre: string }
}

export function useStays(userId: string, isAdmin = false) {
  const [stays, setStays] = useState<(Stay | StayWithProfile)[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase
      .from('stays')
      .select(isAdmin ? '*, profiles(nombre)' : '*')
      .order('fecha_inicio', { ascending: false })
    if (!isAdmin) query = query.eq('user_id', userId)
    const { data } = await query
    setStays(data ?? [])
    setLoading(false)
  }, [userId, isAdmin])

  const fetchMonth = useCallback(async (year: number, month: number) => {
    setLoading(true)
    const desde = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const hasta = new Date(year, month + 1, 0).toISOString().slice(0, 10)

    // Always fetch all stays so every user sees occupied days
    // Admin also gets profile names for the detail panel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = supabase
      .from('stays')
      .select(isAdmin ? '*, profiles(nombre)' : '*, user_id')
      .lte('fecha_inicio', hasta)
      .gte('fecha_fin', desde)

    const { data } = await query
    setStays(data ?? [])
    setLoading(false)
  }, [userId, isAdmin])

  // Returns two sets: own days and others' days for the given month
  function getOccupiedDays(year: number, month: number): { own: Set<string>; others: Set<string> } {
    const own = new Set<string>()
    const others = new Set<string>()
    for (const stay of stays) {
      const isOwn = stay.user_id === userId
      const cursor = new Date(stay.fecha_inicio + 'T12:00:00')
      const end = new Date(stay.fecha_fin + 'T12:00:00')
      while (cursor <= end) {
        if (cursor.getFullYear() === year && cursor.getMonth() === month) {
          const d = cursor.toISOString().slice(0, 10)
          if (isOwn) own.add(d)
          else others.add(d)
        }
        cursor.setDate(cursor.getDate() + 1)
      }
    }
    return { own, others }
  }

  // Returns stays that overlap with a given range
  function getStaysInRange(start: string, end: string) {
    return stays.filter(s => s.fecha_inicio <= end && s.fecha_fin >= start)
  }

  async function bookStay(fechaInicio: string, fechaFin: string, notas?: string) {
    const { error } = await supabase
      .from('stays')
      .insert({ user_id: userId, fecha_inicio: fechaInicio, fecha_fin: fechaFin, notas: notas ?? null })
    if (error) throw error
  }

  async function deleteStay(id: number) {
    const { error } = await supabase.from('stays').delete().eq('id', id)
    if (error) throw error
  }

  return { stays, loading, fetchAll, fetchMonth, getOccupiedDays, getStaysInRange, bookStay, deleteStay }
}
