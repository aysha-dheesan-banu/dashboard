import { Link } from 'react-router-dom'
import { Rocket, Shield, Zap, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="container py-6 flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
          MODERN.IO
        </div>
        <div className="flex gap-8 items-center">
          <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Login</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mt-20 text-center animate-fade-in">
        <h1 className="text-6xl mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent" style={{fontSize: '4rem', marginBottom: '1.5rem'}}>
          Build Your Future <br /> With Modern Tech
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          The all-in-one platform to manage your digital assets, collaborate with teams, 
          and scale your business with lightning speed and security.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/signup" className="btn-primary" style={{padding: '1rem 2rem'}}>
            Start for Free <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="container mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-8">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
            <Zap size={24} />
          </div>
          <h3 className="text-xl mb-2">Lightning Fast</h3>
          <p className="text-slate-400">Optimized for performance and user experience across all devices.</p>
        </div>
        <div className="glass p-8">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 text-cyan-400">
            <Shield size={24} />
          </div>
          <h3 className="text-xl mb-2">Secure by Default</h3>
          <p className="text-slate-400">Enterprise-grade security features to keep your data safe and private.</p>
        </div>
        <div className="glass p-8">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
            <Rocket size={24} />
          </div>
          <h3 className="text-xl mb-2">Scalable Infrastructure</h3>
          <p className="text-slate-400">Grow from zero to millions of users without worrying about the backend.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mt-40 py-10 border-t border-slate-800 text-center text-slate-500 text-sm">
        © 2024 Modern.io. All rights reserved.
      </footer>
    </div>
  )
}
