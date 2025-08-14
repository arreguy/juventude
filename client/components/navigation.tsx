"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, BarChart3, Menu, X, ChevronRight, Settings } from "lucide-react"

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/membros", label: "Membros", icon: Users },
  { href: "/ministerios", label: "Ministérios", icon: Settings },
  { href: "/eventos", label: "Eventos", icon: Calendar },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden bg-black-sidebar border-b border-gray-700/50 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-yellow-vibrant">JUVENTUDE</h1>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="absolute top-16 left-0 right-0 bg-black-sidebar border-b border-gray-700/50 animate-slide-up">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                      isActive ? "bg-blue-primary text-white" : "hover:bg-gray-800 text-light-gray"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="opacity-50" />
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-full w-64 bg-black-sidebar border-r border-gray-700/50 z-30">
        <div className="p-6 border-b border-gray-700/50">
          <h1 className="text-xl font-black text-yellow-vibrant">JUVENTUDE</h1>
          
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-blue-primary text-white" : "hover:bg-gray-800 text-light-gray"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black-sidebar border-t border-gray-700/50 z-50">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center py-3 px-2 transition-all duration-200 ${
                  isActive ? "text-blue-primary" : "text-gray-400 hover:text-light-gray"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
