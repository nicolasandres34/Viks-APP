import { useEffect } from 'react'
import { useStays, Stay } from '../hooks/useStays'
import toast from 'react-hot-toast'

type Props = { userId: string }

export default function MyHistory({ userId }: Props) {
  const { stays, loading, fetchAll, deleteStay } = useStays(userId, false)

  useEffect(() => { fetchAll() }, [fetchAll])

  const todayStr = new Date().toISOString().slice(0, 10)
  const upcoming = stays.filter(s => s.fecha_fin >= todayStr)
    .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio))
  const past = stays.filter(s => s.fecha_fin < todayStr)
    .sort((a, b) => b.fecha_inicio.localeCompare(a.fecha_inicio))

  async function handleDelete(id: number) {
    try {
      await deleteStay(id)
      toast.success('Stay removed')
      fetchAll()
    } catch {
      toast.error('Failed to remove stay.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (stays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <span className="text-4xl">📅</span>
        <p className="text-slate-300 font-medium">No stays booked yet</p>
        <p className="text-slate-500 text-sm">Go to the Calendar tab and select a date range to book your first stay</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upcoming */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-green-400 text-base">●</span>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Upcoming stays ({upcoming.length})
          </h3>
        </div>

        {upcoming.length === 0 ? (
          <p className="text-slate-500 text-sm pl-5">No upcoming stays</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map(s => (
              <StayCard key={s.id} stay={s} todayStr={todayStr} onDelete={handleDelete} />
            ))}
          </ul>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-slate-700" />

      {/* Past */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-slate-500 text-base">●</span>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Past stays ({past.length})
          </h3>
        </div>

        {past.length === 0 ? (
          <p className="text-slate-500 text-sm pl-5">No past stays</p>
        ) : (
          <ul className="space-y-2">
            {past.map(s => (
              <StayCard key={s.id} stay={s} todayStr={todayStr} onDelete={handleDelete} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function StayCard({ stay, todayStr, onDelete }: {
  stay: Stay
  todayStr: string
  onDelete: (id: number) => void
}) {
  const isActive = stay.fecha_inicio <= todayStr && stay.fecha_fin >= todayStr
  const isFuture = stay.fecha_inicio > todayStr
  const nights = daysBetween(stay.fecha_inicio, stay.fecha_fin)

  return (
    <li className={`flex items-center justify-between rounded-xl px-4 py-3 border transition
      ${isActive
        ? 'bg-green-900/20 border-green-700/50'
        : isFuture
          ? 'bg-slate-800 border-slate-700'
          : 'bg-slate-800/50 border-slate-700/50 opacity-70'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-green-400' : isFuture ? 'bg-blue-400' : 'bg-slate-500'}`} />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-100">
              {fmtDate(stay.fecha_inicio)}
              {stay.fecha_fin !== stay.fecha_inicio && ` – ${fmtDate(stay.fecha_fin)}`}
            </p>
            {isActive && (
              <span className="text-xs bg-green-900/50 text-green-400 border border-green-700/50 rounded-full px-2 py-0.5">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {nights} night{nights !== 1 ? 's' : ''}
            {stay.notas && ` · ${stay.notas}`}
          </p>
        </div>
      </div>

      {(isFuture || isActive) && (
        <button
          onClick={() => onDelete(stay.id)}
          className="text-slate-500 hover:text-red-400 text-xs transition ml-3 flex-shrink-0"
        >
          Remove
        </button>
      )}
    </li>
  )
}

function fmtDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function daysBetween(start: string, end: string) {
  const a = new Date(start + 'T12:00:00')
  const b = new Date(end + 'T12:00:00')
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000))
}
