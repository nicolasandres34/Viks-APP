import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAccesos } from '../hooks/useAccesos'
import { formatDateTime } from '../lib/utils'

type Props = {
  userId: string
  tipo: 'entrada' | 'salida'
  compact?: boolean
}

export default function AccessButton({ userId, tipo, compact = false }: Props) {
  const { registrar } = useAccesos(userId)
  const [loading, setLoading] = useState(false)
  const [now, setNow] = useState(() => new Date())

  const isEntry = tipo === 'entrada'
  const label = isEntry ? 'Entry' : 'Exit'
  const icon = isEntry ? '🔓' : '🔒'
  const baseColor = isEntry
    ? 'bg-green-600 hover:bg-green-500 active:bg-green-700 border-green-500'
    : 'bg-red-600 hover:bg-red-500 active:bg-red-700 border-red-500'

  async function handlePress() {
    const ts = new Date()
    setNow(ts)
    setLoading(true)
    try {
      await registrar(tipo)
      toast.success(`${label} logged at ${formatDateTime(ts.toISOString())}`)
    } catch {
      toast.error('Failed to log. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <button
        onClick={handlePress}
        disabled={loading}
        className={`w-full flex flex-col items-center justify-center gap-1.5 py-5 rounded-2xl border-2 text-white font-bold transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${baseColor}`}
        style={{ minHeight: '100px' }}
      >
        <span className="text-3xl">{icon}</span>
        <span className="text-base">{loading ? '...' : label}</span>
        <span className="text-xs font-normal opacity-75">{formatDateTime(now.toISOString())}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handlePress}
      disabled={loading}
      className={`w-full flex flex-col items-center justify-center gap-2 py-8 rounded-2xl border-2 text-white font-bold text-2xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${baseColor}`}
      style={{ minHeight: '160px' }}
    >
      <span className="text-4xl">{icon}</span>
      <span>{loading ? 'Logging...' : `Log ${label}`}</span>
      <span className="text-base font-normal opacity-80">{formatDateTime(now.toISOString())}</span>
    </button>
  )
}
