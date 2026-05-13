import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post('/api/register', { username, email, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-10 w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold mb-2 text-center">Create Account</h2>
        <p className="text-slate-400 text-center mb-8">Join thousands of builders today</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-lg mb-6 flex items-center gap-3">
            <CheckCircle size={20} />
            <span className="text-sm">Account created! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
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
            <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input 
              type="email" 
              placeholder="Email address" 
              className="input-field pl-10" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <UserPlus size={20} /> Sign Up
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
