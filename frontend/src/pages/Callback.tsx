import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Callback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const state = params.get('state')
      
      const storedState = localStorage.getItem('oauth_state')
      if (state !== storedState) {
        setError('Security check failed: Invalid state. Please try logging in again.')
        return
      }

      try {
        const response = await axios.post('/api/sso/callback', { code })
        localStorage.setItem('token', response.data.access_token)
        window.location.href = '/dashboard'
      } catch (err: any) {
        console.error('SSO Exchange failed', err)
        setError(err.response?.data?.detail || 'Failed to exchange SSO code for a token.')
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 max-w-md w-full text-center border-red-500/30">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Login Error</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button onClick={() => navigate('/login')} className="btn-primary w-full justify-center">
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4 mx-auto"></div>
        <p className="text-slate-400">Authenticating with Wytnet...</p>
      </div>
    </div>
  )
}
