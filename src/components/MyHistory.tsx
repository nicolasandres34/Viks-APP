import { useEffect } from 'react'
import { useAccesos } from '../hooks/useAccesos'
import { formatDateTime } from '../lib/utils'

type Props = { userId: string }

export default function MyHistory({ userId }: Props) {
  const { accesos, total, page, loading, fetch, PAGE_SIZE } = useAccesos(userId)

  useEffect(() => { fetch(0) }, [fetch])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-100">My History</h2>

      {loading && (
        <div className="flex justify-center py-10"><Spinner /></div>
      )}

      {!loading && accesos.length === 0 && (
        <p className="text-slate-400 text-center py-10">No records yet.</p>
      )}

      {!loading && accesos.length > 0 && (
        <>
          <ul className="space-y-2">
            {accesos.map(a => (
              <li key={a.id} className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-3 border border-slate-700">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${a.tipo === 'entrada' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="font-medium">{a.tipo === 'entrada' ? 'Entry' : 'Exit'}</span>
                </div>
                <span className="text-slate-400 text-sm">{formatDateTime(a.timestamp)}</span>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => fetch(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-sm transition"
              >
                ← Previous
              </button>
              <span className="text-slate-400 text-sm">Page {page + 1} of {totalPages}</span>
              <button
                onClick={() => fetch(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-sm transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Spinner() {
  return <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
}
