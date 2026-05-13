import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'

export default function Login({ setAuth }: { setAuth: (val: boolean) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)

      const response = await axios.post('/api/token', formData)
      localStorage.setItem('token', response.data.access_token)
      setAuth(true)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
    }
  }

  const signInWithSSO = async () => {
    const state = Math.random().toString(36).substring(7)
    localStorage.setItem('oauth_state', state)
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: 'client_Q1gUNPP1OYeu-lgrKWkTkw',
      redirect_uri: 'https://dashbaord.dhilip.in/callback',
      scope: 'openid profile email',
      state: state,
    })
    
    window.location.href = `https://api.wytnet.com/oauth/authorize?${params}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-10 w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back</h2>
        <p className="text-slate-400 text-center mb-8">Sign in to continue to your dashboard</p>

        <button 
          onClick={signInWithSSO}
          className="btn-primary w-full justify-center mb-6"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #9333ea)' }}
        >
          Sign in with Wytnet
        </button>

        <div className="relative mb-8 text-center">
          <hr className="border-slate-800" />
          <span className="bg-slate-900 px-3 text-sm text-slate-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            OR LOGIN WITH
          </span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Username" 
              className="input-field pl-10" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field pl-10" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center mt-2">
            <LogIn size={20} /> Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Don't have an account? <Link to="/signup" className="text-indigo-400 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
