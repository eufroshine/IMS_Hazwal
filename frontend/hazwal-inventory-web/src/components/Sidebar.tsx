'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Truck,
  Navigation,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/stores/useStore';
import { cn } from '@/utils/cn';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Stok Bahan Kimia', href: '/chemicals' },
  { icon: Truck, label: 'Manajemen Kendaraan', href: '/trucks' },
  { icon: Navigation, label: 'Pengiriman', href: '/deliveries' },
  { icon: BarChart3, label: 'Laporan', href: '/reports' },
];

export default function Sidebar() {
  const { sidebarOpen } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/adminauth/logout', { method: 'POST' });
    } catch (err) {
      // ignore network errors, still proceed to clear client state
      console.error('Logout error', err);
    }
    try { localStorage.removeItem('token'); } catch {}
    router.push('/login');
  };

  return (
    <aside
      className={cn(
        'h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col shrink-0 overflow-hidden',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
      style={{
        transition: sidebarOpen 
          ? 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)' 
          : 'width 400ms cubic-bezier(0.4, 0, 0.2, 1) 200ms'
      }}
    >
      {/* Navigation Label */}
      <div 
        className={cn(
          'px-4 pt-5 overflow-hidden',
          sidebarOpen ? 'pb-5 opacity-100 max-h-16' : 'pb-0 opacity-0 max-h-4'
        )}
        style={{
          transition: sidebarOpen 
            ? 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 300ms' 
            : 'all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
        }}
      >
        <p className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider whitespace-nowrap">
          Menu
        </p>
      </div>

      {/* Menu Items */}
      <nav className={cn(
        'flex-1 px-3 py-2',
        sidebarOpen ? 'overflow-y-auto' : 'overflow-hidden'
      )} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-xl group relative',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                sidebarOpen ? 'px-4 py-3.5 gap-4' : 'py-3.5 justify-center'
              )}
              style={{
                transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon size={22} className="flex-shrink-0" />
              <span 
                className={cn(
                  'text-sm font-medium whitespace-nowrap overflow-hidden',
                  sidebarOpen ? 'opacity-100 max-w-[180px]' : 'opacity-0 max-w-0'
                )}
                style={{
                  transition: sidebarOpen 
                    ? 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 250ms' 
                    : 'all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <ChevronRight 
                  size={16} 
                  className={cn(
                    'ml-auto',
                    sidebarOpen ? 'opacity-60' : 'opacity-0 absolute'
                  )}
                  style={{
                    transition: sidebarOpen 
                      ? 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 350ms' 
                      : 'opacity 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                  }}
                />
              )}
              {/* Tooltip for collapsed state */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-zinc-800 text-zinc-100 text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl border border-zinc-700">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Separator Line */}
      <div className={cn(
        'mx-4 border-t border-sidebar-border',
        sidebarOpen ? 'opacity-100' : 'opacity-30'
      )} 
      style={{ transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
      />

      {/* Footer - User Profile & Actions */}
      <div className="p-3">
        <div className={cn(
          "w-full flex items-center rounded-xl group",
          sidebarOpen ? "px-4 py-3 gap-4" : "px-2 py-3 justify-center flex-col gap-2"
        )}
        style={{
          transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">AD</span>
          </div>
          
          <div 
            className={cn(
              'text-left min-w-0 overflow-hidden flex-1',
              sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
            )}
            style={{
              transition: sidebarOpen 
                ? 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 250ms' 
                : 'all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
            }}
          >
            <p className="text-sm font-medium truncate">Admin</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">admin@hazwal.com</p>
          </div>

          {/* Actions Container */}
          <div className={cn(
            'flex gap-2 ml-auto items-center flex-shrink-0',
            sidebarOpen ? 'opacity-100' : 'opacity-0 absolute'
          )}
          style={{
            transition: sidebarOpen 
              ? 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 350ms' 
              : 'opacity 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
          }}>
            {/* Settings Button */}
            <Link
              href="/settings"
              className={cn(
                'p-2 rounded-lg hover:bg-sidebar-accent transition-colors',
                pathname === '/settings' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70'
              )}
              title="Pengaturan"
            >
              <Settings size={18} />
            </Link>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              className="p-2 rounded-lg hover:bg-red-500/20 text-sidebar-foreground/70 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Tooltips for collapsed state */}
          {!sidebarOpen && (
            <>
              <div className="absolute left-full ml-3 px-3 py-2 bg-zinc-800 text-zinc-100 text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl border border-zinc-700">
                Admin
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}