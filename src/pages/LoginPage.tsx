import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-slate-100">Access Control</h1>
          <p className="text-slate-400 mt-1 text-sm">Sign in with your credentials</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
