import { useEffect, useState } from 'react'
import axios from 'axios'
import { LayoutDashboard, LogOut, User, Activity, Globe, Settings, Bell } from 'lucide-react'

export default function Dashboard({ logout }: { logout: () => void }) {
  const [user, setUser] = useState<{ username: string, email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(response.data)
      } catch (err) {
        logout()
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [logout])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  )

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 glass rounded-none border-y-0 border-l-0 p-6 flex flex-col">
        <div className="text-xl font-bold mb-10 px-2 text-indigo-400">MODERN.IO</div>
        
        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-3 p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 p-3 text-slate-400 hover:bg-white/5 rounded-lg transition-colors">
            <Activity size={20} /> Analytics
          </a>
          <a href="#" className="flex items-center gap-3 p-3 text-slate-400 hover:bg-white/5 rounded-lg transition-colors">
            <Globe size={20} /> Deployment
          </a>
          <a href="#" className="flex items-center gap-3 p-3 text-slate-400 hover:bg-white/5 rounded-lg transition-colors">
            <Settings size={20} /> Settings
          </a>
        </nav>

        <button 
          onClick={logout}
          className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/5 rounded-lg transition-colors mt-auto"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl">Welcome back, {user?.username}!</h1>
            <p className="text-slate-400">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex gap-4">
            <button className="glass p-2.5 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 glass py-1.5 px-3 rounded-full">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center font-bold">
                {user?.username[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium">{user?.username}</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass p-6">
            <p className="text-slate-400 text-sm mb-1">Total Views</p>
            <h4 className="text-2xl font-bold">128.4k</h4>
            <div className="text-emerald-400 text-xs mt-2 font-medium">↑ 12.5% from last month</div>
          </div>
          <div className="glass p-6">
            <p className="text-slate-400 text-sm mb-1">Active Users</p>
            <h4 className="text-2xl font-bold">4,291</h4>
            <div className="text-emerald-400 text-xs mt-2 font-medium">↑ 8.2% from last month</div>
          </div>
          <div className="glass p-6">
            <p className="text-slate-400 text-sm mb-1">Server Uptime</p>
            <h4 className="text-2xl font-bold">99.99%</h4>
            <div className="text-emerald-400 text-xs mt-2 font-medium">Healthy</div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="glass p-6">
          <h3 className="text-xl mb-6">Recent Projects</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                    <Globe size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Project Delta {i}</div>
                    <div className="text-xs text-slate-500">Last updated 2 days ago</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">Production</span>
                  <button className="text-slate-500 hover:text-white transition-colors"><Settings size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
