'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Bell, Search, X, Package, Truck, Navigation, ChevronRight, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useStore } from '@/stores/useStore';

interface Notification {
  id: number;
  title: string;
  message: string;
  detail: string;
  type: 'warning' | 'success' | 'info';
  time: string;
  link?: string;
  read: boolean;
}

const defaultNotifications: Notification[] = [
  { 
    id: 1, 
    title: 'Stok Rendah', 
    message: 'Asam Sulfat hampir habis (5 kg tersisa)', 
    detail: 'Stok Asam Sulfat (H2SO4) saat ini hanya tersisa 5 kg dari minimum 20 kg. Segera lakukan pemesanan ulang untuk menghindari kehabisan stok.',
    type: 'warning', 
    time: '5 menit lalu',
    link: '/chemicals',
    read: false
  },
  { 
    id: 2, 
    title: 'Pengiriman Selesai', 
    message: 'Pengiriman #DEL-001 telah sampai', 
    detail: 'Pengiriman dengan ID #DEL-001 telah berhasil sampai di tujuan PT ABC Industries.',
    type: 'success', 
    time: '1 jam lalu',
    link: '/deliveries',
    read: false
  },
  { 
    id: 3, 
    title: 'Truk Maintenance', 
    message: 'B 1234 ABC perlu servis rutin', 
    detail: 'Kendaraan dengan plat nomor B 1234 ABC sudah mencapai 10.000 km sejak servis terakhir.',
    type: 'info', 
    time: '2 jam lalu',
    link: '/trucks',
    read: false
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useStore();
  const profile = useStore((s) => s.profile);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [isMac, setIsMac] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // ✅ Load notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hazwal_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(defaultNotifications);
    }
    
    // Detect if user is on Mac
    setIsMac(typeof window !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform));
  }, []);

  // ✅ Save to localStorage when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('hazwal_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ✅ SEMUA HOOKS SUDAH DIPANGGIL, BARU SEKARANG CEK PATHNAME
  // Hide navbar di login page
  if (pathname === '/login') {
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      return updated;
    });
  };

  const handleNotifClick = (notif: Notification) => {
    markAsRead(notif.id);
    setSelectedNotif(notif);
  };

  const handleGoToPage = (link?: string) => {
    if (link) {
      setSelectedNotif(null);
      setNotifOpen(false);
      router.push(link);
    }
  };

  const keyboardShortcut = isMac ? '⌘K' : 'Ctrl+K';

  const quickLinks = [
    { href: '/chemicals', icon: Package, label: 'Stok Bahan Kimia' },
    { href: '/trucks', icon: Truck, label: 'Manajemen Kendaraan' },
    { href: '/deliveries', icon: Navigation, label: 'Pengiriman' },
    { href: '/reports', icon: Info, label: 'Laporan' },
  ];

  const filteredLinks = searchQuery
    ? quickLinks.filter(link => link.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : quickLinks;

  return (
    <>
      {/* Dark Theme Navbar */}
      <nav className="h-16 w-full bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800/80 px-6 flex items-center justify-between shrink-0 relative z-50">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 h-10 w-10 hover:scale-105"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          
          <div className="h-6 w-px bg-zinc-700/50 hidden md:block"></div>
          
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-sm font-bold">HZ</span>
            </div>
            <div className="hidden md:block">
              <span className="font-bold text-zinc-100 text-base">Hazwal</span>
              <span className="font-medium text-zinc-400 text-base ml-1">Inventory</span>
            </div>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Bar - Desktop */}
          <div className="hidden md:block relative" ref={searchRef}>
            <div className={`flex items-center gap-2 h-10 rounded-xl border transition-all duration-300 ${
              searchFocused 
                ? 'w-72 bg-zinc-800 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                : 'w-56 bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/80'
            }`}>
              <Search size={16} className={`ml-3 shrink-0 transition-colors ${searchFocused ? 'text-blue-400' : 'text-zinc-500'}`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="flex-1 h-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 mr-2 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <X size={14} className="text-zinc-400" />
                </button>
              ) : (
                <div className="hidden lg:flex items-center gap-1 mr-2">
                  <span className="text-[10px] font-medium text-zinc-500">
                    {isMac ? '⌘' : 'Ctrl'}
                  </span>
                  <span className="w-5 h-5 flex items-center justify-center text-[11px] font-semibold text-zinc-400 bg-zinc-700/80 rounded border border-zinc-600/50">
                    K
                  </span>
                </div>
              )}
            </div>

            {/* Search Dropdown */}
            {searchFocused && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-700/50 overflow-hidden z-50">
                <div className="p-3">
                  <p className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {searchQuery ? 'Search Results' : 'Quick Navigation'}
                  </p>
                  <div className="mt-1 space-y-1">
                    {filteredLinks.length > 0 ? (
                      filteredLinks.map((link) => (
                        <Link 
                          key={link.href}
                          href={link.href} 
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-700/50 transition-all group"
                          onClick={() => {
                            setSearchFocused(false);
                            setSearchQuery('');
                          }}
                        >
                          <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                            <link.icon size={16} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{link.label}</span>
                        </Link>
                      ))
                    ) : (
                      <p className="px-3 py-4 text-sm text-zinc-500 text-center">No results found</p>
                    )}
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-zinc-700/50 bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium">Esc</span>
                    <span>close</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Search Button - Mobile */}
          <button 
            onClick={() => {
              setSearchFocused(true);
              setTimeout(() => searchInputRef.current?.focus(), 0);
            }}
            className="inline-flex md:hidden items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 h-10 w-10"
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 h-10 w-10 relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full ring-2 ring-zinc-900 flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-zinc-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-700/50 overflow-hidden z-50">
                <div className="px-4 py-3.5 border-b border-zinc-700/50 flex items-center justify-between bg-zinc-900/50">
                  <h3 className="font-semibold text-sm text-zinc-100">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => handleNotifClick(notif)}
                      className={`px-4 py-3.5 hover:bg-zinc-700/30 cursor-pointer border-b border-zinc-700/30 last:border-0 transition-all ${
                        !notif.read ? 'bg-blue-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          notif.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                          notif.type === 'success' ? 'bg-green-500/20 text-green-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {notif.type === 'warning' ? <AlertTriangle size={18} /> :
                           notif.type === 'success' ? <CheckCircle size={18} /> :
                           <Info size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm text-zinc-100 ${!notif.read ? 'font-semibold' : 'font-medium'}`}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{notif.message}</p>
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500">
                            <Clock size={11} />
                            <span>{notif.time}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-zinc-600 shrink-0 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-zinc-700/50 bg-zinc-900/50">
                  <Link 
                    href="/notifications" 
                    onClick={() => setNotifOpen(false)}
                    className="text-xs text-blue-400 hover:text-blue-300 w-full text-center block font-medium transition-colors"
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-zinc-700/50 mx-1"></div>

          {/* User Avatar (no logout) */}
          <div className="inline-flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 h-10 px-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-xs font-bold">AD</span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-zinc-200">Admin</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Notification Detail Modal */}
      {selectedNotif && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" 
          onClick={() => setSelectedNotif(null)}
        >
          <div 
            className="w-full max-w-md bg-zinc-800 rounded-xl shadow-2xl border border-zinc-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`px-5 py-4 flex items-center gap-3 border-b ${
              selectedNotif.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
              selectedNotif.type === 'success' ? 'bg-green-500/10 border-green-500/20' :
              'bg-blue-500/10 border-blue-500/20'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                selectedNotif.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                selectedNotif.type === 'success' ? 'bg-green-500/20 text-green-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {selectedNotif.type === 'warning' ? <AlertTriangle size={20} /> :
                 selectedNotif.type === 'success' ? <CheckCircle size={20} /> :
                 <Info size={20} />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-100">{selectedNotif.title}</h3>
                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                  <Clock size={10} />
                  {selectedNotif.time}
                </p>
              </div>
              <button 
                onClick={() => setSelectedNotif(null)}
                className="p-1.5 hover:bg-zinc-700 rounded-md transition-colors"
              >
                <X size={18} className="text-zinc-400" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-4">
              <p className="text-sm font-medium text-zinc-100 mb-2">{selectedNotif.message}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{selectedNotif.detail}</p>
            </div>

            {/* Actions */}
            <div className="px-5 py-4 border-t border-zinc-700 flex items-center justify-end gap-2">
              <button 
                onClick={() => setSelectedNotif(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Tutup
              </button>
              {selectedNotif.link && (
                <button 
                  onClick={() => handleGoToPage(selectedNotif.link)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1"
                >
                  Lihat Detail
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}