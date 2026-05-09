import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'

export default function App() {
  const { session, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !profile) return <LoginPage />
  if (profile.role === 'admin') return <AdminPage profile={profile} onSignOut={signOut} />
  return <HomePage profile={profile} onSignOut={signOut} />
}
