import { useState, useEffect } from 'react'
import { useStays, StayWithProfile } from '../hooks/useStays'
import { useLang } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'

type Props = {
  userId: string
  isAdmin?: boolean
}

export default function CalendarView({ userId, isAdmin = false }: Props) {
  const { t } = useLang()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [rangeStart, setRangeStart] = useState<string | null>(null)
  const [rangeEnd, setRangeEnd] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [booking, setBooking] = useState(false)

  const { loading, fetchMonth, getOccupiedDays, getStaysInRange, bookStay, deleteStay } = useStays(userId, isAdmin)

  useEffect(() => { fetchMonth(year, month) }, [year, month, fetchMonth])

  function prevMonth() {
    clearSelection()
    if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1)
  }
  function nextMonth() {
    clearSelection()
    if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1)
  }
  function clearSelection() { setRangeStart(null); setRangeEnd(null); setNotes('') }

  function handleDayClick(dateStr: string) {
    if (!rangeStart || rangeEnd) { setRangeStart(dateStr); setRangeEnd(null); return }
    if (dateStr === rangeStart) { clearSelection(); return }
    if (dateStr > rangeStart) setRangeEnd(dateStr)
    else { setRangeStart(dateStr); setRangeEnd(null) }
  }

  async function handleBook() {
    if (!rangeStart) return
    const end = rangeEnd ?? rangeStart
    setBooking(true)
    try {
      await bookStay(rangeStart, end, notes || undefined)
      toast.success(`${t.stayBooked} ${fmt(rangeStart)}${end !== rangeStart ? ' – ' + fmt(end) : ''}`)
      clearSelection()
      fetchMonth(year, month)
    } catch {
      toast.error(t.bookFailed)
    } finally {
      setBooking(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteStay(id)
      toast.success(t.stayRemoved)
      fetchMonth(year, month)
    } catch {
      toast.error(t.removeFailed)
    }
  }

  function fmt(iso: string) {
    return new Date(iso + 'T12:00:00').toLocaleDateString(t.locale, { month: 'short', day: 'numeric' })
  }

  const { own: ownDays, others: othersDays } = getOccupiedDays(year, month)
  const effectiveEnd = rangeEnd && rangeEnd >= (rangeStart ?? '') ? rangeEnd : rangeStart
  const selectedStays = rangeStart ? getStaysInRange(rangeStart, effectiveEnd ?? rangeStart) : []
  const ownConflict = selectedStays.some(s => s.user_id === userId)
  const othersConflict = selectedStays.some(s => s.user_id !== userId)

  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ...Array(totalCells - startOffset - daysInMonth).fill(null),
  ]

  const todayStr = today.toISOString().slice(0, 10)
  const isInRange = (d: string) => !!rangeStart && d >= rangeStart && d <= (effectiveEnd ?? rangeStart)
  const isEdge = (d: string) => d === rangeStart || d === effectiveEnd

  const nightsCount = rangeStart && effectiveEnd && effectiveEnd !== rangeStart
    ? daysBetween(rangeStart, effectiveEnd)
    : null

  return (
    <div className="flex flex-col min-h-0 h-full gap-3">

      {/* ── Month nav + stats ── */}
      <div className="flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xl">‹</button>
          <h3 className="font-semibold text-slate-100 text-base">{t.months[month]} {year}</h3>
          <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xl">›</button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <StatChip label={t.yourDays} value={ownDays.size} color="blue" loading={loading} />
        </div>
      </div>

      {/* ── Calendar grid ── */}
      <div className="flex-shrink-0 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-700">
          {t.days.map(d => (
            <div key={d} className="text-center text-xs text-slate-500 py-2 lg:py-3 font-medium">{d}</div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-6 h-6 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) return (
                <div key={`e-${i}`}
                  className={`h-10 lg:h-20 ${i % 7 !== 6 ? 'border-r border-slate-700/30' : ''} ${i >= 7 ? 'border-t border-slate-700/30' : ''}`}
                />
              )
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isOwn = ownDays.has(dateStr)
              const isOthers = othersDays.has(dateStr)
              const isToday = dateStr === todayStr
              const inRange = isInRange(dateStr)
              const onEdge = isEdge(dateStr)

              return (
                <button
                  key={dateStr}
                  onClick={() => handleDayClick(dateStr)}
                  className={`h-10 lg:h-20 flex flex-col items-center justify-center gap-0.5 transition select-none
                    ${onEdge ? 'bg-blue-600' : inRange ? 'bg-blue-600/20' : ''}
                    ${!inRange && !onEdge && isToday ? 'bg-slate-700/60' : ''}
                    ${!inRange && !onEdge && !isToday ? 'hover:bg-slate-700/40' : ''}
                    ${i % 7 !== 6 ? 'border-r border-slate-700/30' : ''}
                    ${i >= 7 ? 'border-t border-slate-700/30' : ''}
                  `}
                >
                  <span className={`text-xs lg:text-base font-medium leading-none
                    ${onEdge ? 'text-white' : isToday ? 'text-blue-400' : 'text-slate-300'}`}>
                    {day}
                  </span>
                  {(isOwn || isOthers) && (
                    <div className="flex gap-0.5 lg:gap-1">
                      {isOwn && <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-blue-400" />}
                      {isOthers && <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-red-500" />}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Hint / booking panel ── */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {!rangeStart && (
          <p className="text-xs text-slate-500 text-center pt-1">{t.clickHint}</p>
        )}

        {rangeStart && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700">
              <div>
                <p className="font-medium text-slate-200 text-sm">
                  {effectiveEnd && effectiveEnd !== rangeStart
                    ? `${fmt(rangeStart)} – ${fmt(effectiveEnd)}`
                    : fmt(rangeStart)}
                </p>
                {nightsCount && (
                  <p className="text-xs text-slate-500">{t.nights(nightsCount)}</p>
                )}
              </div>
              <button onClick={clearSelection} className="text-slate-500 hover:text-slate-300 text-xs transition">{t.clear}</button>
            </div>

            {/* Existing stays in range */}
            {selectedStays.length > 0 && (
              <div className="px-4 py-2.5 space-y-2 border-b border-slate-700">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{t.bookedInPeriod}</p>
                {selectedStays.map(s => {
                  const isOwn = s.user_id === userId
                  const canDelete = isAdmin || isOwn
                  const name = isAdmin
                    ? (s as StayWithProfile).profiles?.nombre ?? '—'
                    : isOwn ? t.you : null
                  const stayNights = daysBetween(s.fecha_inicio, s.fecha_fin)

                  return (
                    <div key={s.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOwn ? 'bg-blue-400' : 'bg-red-500'}`} />
                        <div>
                          {name
                            ? <p className="text-sm font-medium text-slate-200">{name}</p>
                            : <p className="text-sm font-medium text-slate-400">{t.occupied}</p>
                          }
                          <p className="text-xs text-slate-400">
                            {fmt(s.fecha_inicio)} – {fmt(s.fecha_fin)}
                            {' · '}{t.nights(stayNights)}
                          </p>
                          {s.notas && <p className="text-xs text-slate-500">{s.notas}</p>}
                        </div>
                      </div>
                      {canDelete && (
                        <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300 text-xs ml-3 transition flex-shrink-0">{t.remove}</button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Book form */}
            {ownConflict ? (
              <p className="text-xs text-amber-400 text-center px-4 py-3">{t.ownConflict}</p>
            ) : othersConflict ? (
              <p className="text-xs text-red-400 text-center px-4 py-3">{t.othersConflict}</p>
            ) : (
              <div className="px-4 py-3 space-y-2.5">
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={t.notesOptional}
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm transition"
                >
                  {booking ? t.booking : `${t.bookStay}${nightsCount ? ` · ${t.nights(nightsCount)}` : ` · ${t.nights(1)}`}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function daysBetween(start: string, end: string) {
  const a = new Date(start + 'T12:00:00')
  const b = new Date(end + 'T12:00:00')
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000))
}

function StatChip({ label, value, color, loading }: {
  label: string; value: number; color: 'blue' | 'red'; loading: boolean
}) {
  const colors = { blue: 'text-blue-400', red: 'text-red-400' }
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center">
      <p className={`text-lg font-bold ${colors[color]}`}>{loading ? '—' : value}</p>
      <p className="text-xs text-slate-500 leading-tight">{label}</p>
    </div>
  )
}
