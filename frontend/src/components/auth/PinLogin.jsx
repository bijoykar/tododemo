import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { login, setupPin, getAuthStatus } from '../../api/auth'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function PinLogin() {
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSetup, setIsSetup] = useState(false)
  const { setToken, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (isAuthenticated) { navigate('/weekly'); return }
    getAuthStatus()
      .then(data => { if (data.status === 'setup_required' || searchParams.get('setup')) setIsSetup(true) })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pin || pin.length < 4) { toast.error('PIN must be at least 4 characters'); return }
    if (isSetup && pin !== confirmPin) { toast.error('PINs do not match'); return }

    setLoading(true)
    try {
      if (isSetup) {
        await setupPin(pin)
        toast.success('PIN set! Please log in.')
        setIsSetup(false)
        setPin('')
        setConfirmPin('')
      } else {
        const { accessToken } = await login(pin)
        setToken(accessToken)
        navigate('/weekly')
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-8 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">TodoPlanner</h1>
          <p className="text-indigo-200 text-sm mt-1">
            {isSetup ? 'Create your PIN to get started' : 'Welcome back'}
          </p>
        </div>

        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {isSetup ? 'Create PIN' : 'Enter PIN'}
              </label>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="••••••"
                autoFocus
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {isSetup && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm PIN</label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Please wait...' : isSetup ? 'Set PIN & Continue' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
