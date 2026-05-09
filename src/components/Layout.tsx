import { ReactNode } from 'react'
import { Profile } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'

function firstName(nombre: string): string {
  if (nombre.includes('@')) {
    const local = nombre.split('@')[0]
    const first = local.split(/[._\-+]/)[0]
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
  }
  return nombre.split(' ')[0]
}

type Props = {
  profile: Profile
  onSignOut: () => void
  children: ReactNode
}

export default function Layout({ profile, onSignOut, children }: Props) {
  const { lang, t, toggleLang } = useLang()

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      <header className="flex-shrink-0 z-20 bg-slate-800/90 backdrop-blur border-b border-slate-700 safe-top">
        <div className="w-full px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔐</span>
            <span className="font-semibold text-slate-100 truncate max-w-[180px]">{firstName(profile.nombre)}</span>
            {profile.role === 'admin' && (
              <span className="text-xs bg-blue-600/30 text-blue-400 border border-blue-600/40 rounded-full px-2 py-0.5">
                {t.admin}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="text-xs font-semibold text-slate-400 hover:text-slate-100 border border-slate-600 hover:border-slate-500 rounded-lg px-2.5 py-1.5 transition hover:bg-slate-700"
            >
              {lang === 'en' ? 'HR' : 'EN'}
            </button>
            <button
              onClick={onSignOut}
              className="text-slate-400 hover:text-slate-100 text-sm transition px-3 py-1.5 rounded-lg hover:bg-slate-700"
            >
              {t.signOut}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col">
        {children}
      </main>
    </div>
  )
}
