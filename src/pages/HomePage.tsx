import { useState } from 'react'
import { Profile } from '../lib/supabase'
import Layout from '../components/Layout'
import MyHistory from '../components/MyHistory'
import CalendarView from '../components/CalendarView'

type Tab = 'home' | 'history'

type Props = { profile: Profile; onSignOut: () => void }

export default function HomePage({ profile, onSignOut }: Props) {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <Layout profile={profile} onSignOut={onSignOut}>
      {/* ── Desktop: sidebar 1/4 + content 3/4, no outer scroll ── */}
      <div className="hidden lg:flex flex-1 min-h-0">
        <aside className="w-1/4 flex-shrink-0 border-r border-slate-700 bg-slate-800/40 flex flex-col p-6 gap-6 overflow-y-auto">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Property</p>
            <p className="text-slate-100 font-medium">Access Control</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Select a range on the calendar to book a stay</p>
          </div>

          <nav className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Navigation</p>
            <NavItem active={tab === 'home'} onClick={() => setTab('home')} icon="📅">Calendar</NavItem>
            <NavItem active={tab === 'history'} onClick={() => setTab('history')} icon="📋">My Stays</NavItem>
          </nav>

          <div className="mt-auto space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" /> Occupied
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" /> Selected range
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" /> Today
            </div>
          </div>
        </aside>

        {/* main fills rest, passes full height to CalendarView */}
        <div className="flex-1 min-w-0 flex flex-col p-6 gap-4 overflow-hidden">
          {tab === 'home' && <CalendarView userId={profile.id} />}
          {tab === 'history' && (
            <div className="overflow-y-auto flex-1 min-h-0">
              <MyHistory userId={profile.id} />
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile: tabs + scrollable content ── */}
      <div className="lg:hidden flex-1 min-h-0 flex flex-col">
        <div className="flex-shrink-0 mx-4 mt-4 flex rounded-xl overflow-hidden border border-slate-700">
          <TabBtn active={tab === 'home'} onClick={() => setTab('home')}>Calendar</TabBtn>
          <TabBtn active={tab === 'history'} onClick={() => setTab('history')}>My Stays</TabBtn>
        </div>
        <div className="flex-1 min-h-0 px-4 py-4 overflow-y-auto">
          {tab === 'home' && <CalendarView userId={profile.id} />}
          {tab === 'history' && <MyHistory userId={profile.id} />}
        </div>
      </div>
    </Layout>
  )
}

function NavItem({ active, onClick, icon, children }: {
  active: boolean; onClick: () => void; icon: string; children: React.ReactNode
}) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left
        ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'}`}>
      <span>{icon}</span>{children}
    </button>
  )
}

function TabBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button onClick={onClick}
      className={`flex-1 py-3 text-sm font-medium transition
        ${active ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
      {children}
    </button>
  )
}
