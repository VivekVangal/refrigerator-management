'use client'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? 'nav-link active' : 'nav-link'
  }

  return (
    <nav className="bg-white border-b border-[#edebe9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="text-[#0078d4] text-lg font-semibold">
                Fridge Manager
              </a>
            </div>
            <div className="ml-6 flex space-x-8">
              <a href="/inventory" className={isActive('/inventory')}>
                View Inventory
              </a>
              <a href="/inventory/manage" className={isActive('/inventory/manage')}>
                Manage Inventory
              </a>
              <a href="/inventory/types" className={isActive('/inventory/types')}>
                Manage Types
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 