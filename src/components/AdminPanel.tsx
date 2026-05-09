import { useState, useEffect } from 'react'
import { supabase, Profile } from '../lib/supabase'
import { useAdminAccesos, AdminFilters } from '../hooks/useAccesos'
import { formatDateTime, downloadCSV } from '../lib/utils'
import toast from 'react-hot-toast'

export default function AdminPanel() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filters, setFilters] = useState<AdminFilters>({ userId: '', tipo: '', desde: '', hasta: '' })
  const [activeTab, setActiveTab] = useState<'accesos' | 'usuarios'>('accesos')
  const { accesos, total, page, loading, fetch, PAGE_SIZE } = useAdminAccesos()

  useEffect(() => {
    fetchProfiles()
    fetch({}, 0)
  }, [fetch])

  async function fetchProfiles() {
    const { data } = await supabase.from('profiles').select('*').order('nombre')
    setProfiles(data ?? [])
  }

  function applyFilters(newFilters: AdminFilters) {
    setFilters(newFilters)
    fetch(newFilters, 0)
  }

  async function exportCSV() {
    const { data } = await supabase
      .from('accesos')
      .select('*, profiles(nombre)')
      .order('timestamp', { ascending: false })

    if (!data) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = data.map((a: any) => ({
      name: (Array.isArray(a.profiles) ? a.profiles[0]?.nombre : a.profiles?.nombre) ?? '',
      type: a.tipo === 'entrada' ? 'Entry' : 'Exit',
      timestamp: formatDateTime(a.timestamp),
      notes: a.notas ?? '',
    }))
    downloadCSV(rows, `access_log_${new Date().toISOString().slice(0, 10)}.csv`)
  }

  async function changeRole(userId: string, newRole: 'admin' | 'usuario') {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    if (error) toast.error('Failed to update role')
    else { toast.success('Role updated'); fetchProfiles() }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-100">Admin Panel</h2>

      <div className="flex rounded-xl overflow-hidden border border-slate-700">
        {(['accesos', 'usuarios'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {tab === 'accesos' ? 'Access Logs' : 'Users'}
          </button>
        ))}
      </div>

      {activeTab === 'accesos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">User</label>
              <select
                value={filters.userId}
                onChange={e => applyFilters({ ...filters, userId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              >
                <option value="">All</option>
                {profiles.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Type</label>
              <select
                value={filters.tipo}
                onChange={e => applyFilters({ ...filters, tipo: e.target.value as AdminFilters['tipo'] })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              >
                <option value="">All</option>
                <option value="entrada">Entry</option>
                <option value="salida">Exit</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">From</label>
              <input type="date" value={filters.desde}
                onChange={e => applyFilters({ ...filters, desde: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">To</label>
              <input type="date" value={filters.hasta}
                onChange={e => applyFilters({ ...filters, hasta: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <button
            onClick={exportCSV}
            className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm font-medium transition flex items-center justify-center gap-2"
          >
            ⬇ Export CSV
          </button>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500">{total} record{total !== 1 ? 's' : ''}</p>
              <div className="overflow-x-auto rounded-xl border border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="text-left px-3 py-2.5 text-slate-400 font-medium">Name</th>
                      <th className="text-left px-3 py-2.5 text-slate-400 font-medium">Type</th>
                      <th className="text-left px-3 py-2.5 text-slate-400 font-medium">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accesos.map(a => (
                      <tr key={a.id} className="border-t border-slate-700 hover:bg-slate-800/50">
                        <td className="px-3 py-2.5 text-slate-200">{a.profiles?.nombre ?? '—'}</td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            a.tipo === 'entrada' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                          }`}>
                            {a.tipo === 'entrada' ? 'Entry' : 'Exit'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-400 whitespace-nowrap">{formatDateTime(a.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {accesos.length === 0 && <p className="text-center text-slate-500 py-8">No results</p>}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                  <button onClick={() => fetch(filters, page - 1)} disabled={page === 0}
                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-sm transition">
                    ← Previous
                  </button>
                  <span className="text-slate-400 text-sm">{page + 1} / {totalPages}</span>
                  <button onClick={() => fetch(filters, page + 1)} disabled={page >= totalPages - 1}
                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-sm transition">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'usuarios' && (
        <div className="space-y-2">
          {profiles.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
              <div>
                <p className="font-medium text-slate-100">{p.nombre}</p>
                <p className="text-xs text-slate-500 mt-0.5">{new Date(p.created_at).toLocaleDateString('en-US')}</p>
              </div>
              <select
                value={p.role}
                onChange={e => changeRole(p.id, e.target.value as 'admin' | 'usuario')}
                className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-100"
              >
                <option value="usuario">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
