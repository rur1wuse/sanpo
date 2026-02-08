import { Link, useLocation } from 'react-router-dom'
import { Home, History, Settings } from 'lucide-react'
import { cn } from '../lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const navItems = [
    { icon: Home, label: '首页', path: '/' },
    { icon: History, label: '记录', path: '/history' },
    { icon: Settings, label: '设置', path: '/settings' },
  ]

  return (
    <div className="min-h-screen bg-[#F5E6D3] text-[#2D5016] font-sans">
      <main className="container mx-auto px-4 py-6 pb-24 max-w-md min-h-screen flex flex-col">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#2D5016]/10 pb-safe">
        <div className="container mx-auto px-6 max-w-md">
          <div className="flex justify-between items-center h-16">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                    isActive 
                      ? "text-[#2D5016]" 
                      : "text-[#2D5016]/40 hover:text-[#2D5016]/60"
                  )}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
