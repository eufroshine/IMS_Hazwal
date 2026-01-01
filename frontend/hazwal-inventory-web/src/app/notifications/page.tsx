'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock, 
  ChevronRight,
  Check,
  Trash2,
  Filter,
  Search
} from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  detail: string;
  type: 'warning' | 'success' | 'info';
  time: string;
  date: string;
  link?: string;
  read: boolean;
}

const defaultNotifications: Notification[] = [
  { 
    id: 1, 
    title: 'Stok Rendah', 
    message: 'Asam Sulfat hampir habis (5 kg tersisa)', 
    detail: 'Stok Asam Sulfat (H2SO4) saat ini hanya tersisa 5 kg dari minimum 20 kg. Segera lakukan pemesanan ulang untuk menghindari kehabisan stok. Supplier terakhir: PT Kimia Farma.',
    type: 'warning', 
    time: '5 menit lalu',
    date: '27 Des 2024',
    link: '/chemicals',
    read: false
  },
  { 
    id: 2, 
    title: 'Pengiriman Selesai', 
    message: 'Pengiriman #DEL-001 telah sampai', 
    detail: 'Pengiriman dengan ID #DEL-001 telah berhasil sampai di tujuan PT ABC Industries pada tanggal 27 Desember 2024 pukul 14:30 WIB. Driver: Budi Santoso. Kendaraan: B 1234 ABC.',
    type: 'success', 
    time: '1 jam lalu',
    date: '27 Des 2024',
    link: '/deliveries',
    read: false
  },
  { 
    id: 3, 
    title: 'Truk Maintenance', 
    message: 'B 1234 ABC perlu servis rutin', 
    detail: 'Kendaraan dengan plat nomor B 1234 ABC sudah mencapai 10.000 km sejak servis terakhir. Jadwalkan servis rutin untuk penggantian oli, filter udara, dan pengecekan rem.',
    type: 'info', 
    time: '2 jam lalu',
    date: '27 Des 2024',
    link: '/trucks',
    read: true
  },
  { 
    id: 4, 
    title: 'Stok Rendah', 
    message: 'Natrium Hidroksida hampir habis (8 kg tersisa)', 
    detail: 'Stok Natrium Hidroksida (NaOH) saat ini hanya tersisa 8 kg dari minimum 15 kg. Segera lakukan pemesanan ulang.',
    type: 'warning', 
    time: '3 jam lalu',
    date: '27 Des 2024',
    link: '/chemicals',
    read: true
  },
  { 
    id: 5, 
    title: 'Pengiriman Dijadwalkan', 
    message: 'Pengiriman #DEL-005 dijadwalkan untuk besok', 
    detail: 'Pengiriman #DEL-005 ke PT XYZ Corp dijadwalkan untuk 28 Desember 2024 pukul 08:00 WIB. Pastikan kendaraan dan bahan kimia sudah siap.',
    type: 'info', 
    time: '5 jam lalu',
    date: '27 Des 2024',
    link: '/deliveries',
    read: true
  },
  { 
    id: 6, 
    title: 'Pengiriman Selesai', 
    message: 'Pengiriman #DEL-002 telah sampai', 
    detail: 'Pengiriman #DEL-002 ke PT DEF Manufacturing berhasil diselesaikan pada 26 Desember 2024.',
    type: 'success', 
    time: '1 hari lalu',
    date: '26 Des 2024',
    link: '/deliveries',
    read: true
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'warning' | 'success' | 'info'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hazwal_notifications_page');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch {
        setNotifications(defaultNotifications);
      }
    } else {
      setNotifications(defaultNotifications);
    }
    
    // Animate in
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('hazwal_notifications_page', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'unread' ? !notif.read :
      notif.type === filter;
    
    const matchesSearch = 
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark as read
  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedNotif?.id === id) {
      setSelectedNotif(null);
    }
  };

  // Get icon by type
  const getIcon = (type: string, size: number = 16) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={size} />;
      case 'success': return <CheckCircle size={size} />;
      default: return <Info size={size} />;
    }
  };

  // Get color classes by type
  const getColorClasses = (type: string) => {
    switch (type) {
      case 'warning': return { bg: 'bg-amber-500/20', text: 'text-amber-400', bgLight: 'bg-amber-500/10' };
      case 'success': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', bgLight: 'bg-emerald-500/10' };
      default: return { bg: 'bg-blue-500/20', text: 'text-blue-400', bgLight: 'bg-blue-500/10' };
    }
  };

  return (
    <div className={`flex flex-col transition-all duration-500 ease-out ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ gap: '2.5rem' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Bell className="w-7 h-7" />
            Notifikasi
          </h1>
          <p className="text-zinc-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
          >
            <Check size={16} />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari notifikasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-700/50 border border-zinc-600 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-700/50 rounded-lg">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'unread', label: 'Belum Dibaca' },
            { key: 'warning', label: 'Peringatan' },
            { key: 'success', label: 'Sukses' },
            { key: 'info', label: 'Info' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as typeof filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === item.key 
                  ? 'bg-zinc-600 text-zinc-100 shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Notification List */}
        <div className="lg:col-span-2 bg-zinc-700/30 rounded-xl border border-zinc-600/50 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell size={48} className="mx-auto text-zinc-600 mb-4" />
              <p className="text-zinc-400">Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-600/50">
              {filteredNotifications.map((notif) => {
                const colors = getColorClasses(notif.type);
                const isSelected = selectedNotif?.id === notif.id;
                
                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markAsRead(notif.id);
                      setSelectedNotif(notif);
                    }}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : ''
                    } ${!notif.read ? 'bg-zinc-700/50' : ''} hover:bg-zinc-700/30`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.bg} ${colors.text}`}>
                        {getIcon(notif.type, 18)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium text-zinc-100 ${!notif.read ? 'font-semibold' : ''}`}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400 mt-0.5 line-clamp-1">{notif.message}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {notif.time}
                          </span>
                          <span>{notif.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                        <ChevronRight size={16} className="text-zinc-500" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 overflow-hidden sticky top-6">
            {selectedNotif ? (
              <>
                {/* Header */}
                <div className={`p-4 ${getColorClasses(selectedNotif.type).bgLight} border-b border-zinc-600/50`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(selectedNotif.type).bg} ${getColorClasses(selectedNotif.type).text}`}>
                      {getIcon(selectedNotif.type, 24)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-100">{selectedNotif.title}</h3>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        {selectedNotif.time} • {selectedNotif.date}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-sm font-medium text-zinc-100 mb-3">{selectedNotif.message}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{selectedNotif.detail}</p>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-zinc-600/50 bg-zinc-800/30 space-y-2">
                  {selectedNotif.link && (
                    <Link
                      href={selectedNotif.link}
                      className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      Lihat Halaman Terkait
                      <ChevronRight size={14} />
                    </Link>
                  )}
                  <button
                    onClick={() => deleteNotification(selectedNotif.id)}
                    className="w-full px-4 py-2.5 text-sm font-medium text-red-400 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} />
                    Hapus Notifikasi
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-zinc-700/50 rounded-full flex items-center justify-center mb-4">
                  <Bell size={24} className="text-zinc-500" />
                </div>
                <p className="text-sm text-zinc-400">Pilih notifikasi untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
