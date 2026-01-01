'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Save,
  Check,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '@/stores/useStore';

type TabType = 'profile' | 'company' | 'notifications' | 'security' | 'system';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [saving, setSaving] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const storeProfile = useStore((s) => s.profile);
  const storeSetProfile = useStore((s) => s.setProfile);
  
  const [profile, setProfile] = useState(() => ({
    name: storeProfile?.name || 'Admin',
    email: storeProfile?.email || 'admin@hazwal.com',
    phone: (storeProfile as any)?.phone || '+62 812 3456 7890',
    role: storeProfile?.role || 'Administrator'
  }));

  const [company, setCompany] = useState({
    name: 'PT Hazwal Perdana Mandiri',
    address: 'Jl. Industri No. 123, Bandung, Jawa Barat',
    phone: '+62 22 1234567',
    email: 'info@hazwal.com',
    website: 'www.hazwal.com'
  });

  const [notifications, setNotifications] = useState({
    stockAlerts: true,
    deliveryUpdates: true,
    maintenanceReminders: true,
    emailNotifications: true,
    pushNotifications: false
  });

  const [system, setSystem] = useState({
    language: 'id',
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    lowStockThreshold: 10
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      storeSetProfile({ name: profile.name, email: profile.email, role: profile.role });
    } catch (err) {
      console.error('Failed to save profile', err);
    }
    setSaving(false);
    toast.success('Pengaturan berhasil disimpan!');
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profil', icon: User },
    { id: 'company' as TabType, label: 'Perusahaan', icon: Building2 },
    { id: 'notifications' as TabType, label: 'Notifikasi', icon: Bell },
    { id: 'security' as TabType, label: 'Keamanan', icon: Shield },
    { id: 'system' as TabType, label: 'Sistem', icon: Database },
  ];

  const notificationItems = [
    { key: 'stockAlerts', label: 'Peringatan Stok Rendah', desc: 'Notifikasi saat stok bahan kimia menipis' },
    { key: 'deliveryUpdates', label: 'Update Pengiriman', desc: 'Notifikasi status pengiriman' },
    { key: 'maintenanceReminders', label: 'Pengingat Maintenance', desc: 'Notifikasi jadwal servis kendaraan' },
    { key: 'emailNotifications', label: 'Notifikasi Email', desc: 'Kirim notifikasi ke email' },
    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Notifikasi browser' },
  ];

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
        enabled ? 'bg-blue-600' : 'bg-zinc-700'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const InputField = ({ label, value, onChange, type = 'text', disabled = false, icon: Icon }: { label: string; value: string; onChange: (value: string) => void; type?: string; disabled?: boolean; icon?: any }) => (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        {Icon && <Icon size={14} className="inline mr-1.5" />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 transition-all ${
          disabled 
            ? 'cursor-not-allowed bg-zinc-900/50 text-zinc-500' 
            : 'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
        }`}
      />
    </div>
  );

  return (
    <div className={`transition-all duration-700 ease-out ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Settings className="w-6 h-6 text-blue-400" />
            </div>
            Pengaturan
          </h1>
          <p className="text-zinc-400 mt-2">Kelola pengaturan aplikasi dan preferensi Anda</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Simpan</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-1 sticky top-20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-blue-400'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">Profil Pengguna</h2>
                  <p className="text-sm text-zinc-400 mt-1">Kelola informasi profil Anda</p>
                </div>

                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-3xl font-bold">AD</span>
                  </div>
                  <div>
                    <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-lg transition-colors text-sm border border-zinc-700">
                      Ubah Foto
                    </button>
                    <p className="text-xs text-zinc-500 mt-2">JPG, PNG. Maks 2MB</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField 
                    label="Nama Lengkap" 
                    value={profile.name}
                    onChange={(val) => setProfile({ ...profile, name: val })}
                  />
                  <InputField 
                    label="Email" 
                    type="email"
                    value={profile.email}
                    onChange={(val) => setProfile({ ...profile, email: val })}
                    icon={Mail}
                  />
                  <InputField 
                    label="Nomor Telepon" 
                    type="tel"
                    value={profile.phone}
                    onChange={(val) => setProfile({ ...profile, phone: val })}
                    icon={Phone}
                  />
                  <InputField 
                    label="Role" 
                    value={profile.role}
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>
            )}

            {/* Company Tab */}
            {activeTab === 'company' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">Informasi Perusahaan</h2>
                  <p className="text-sm text-zinc-400 mt-1">Kelola informasi perusahaan Anda</p>
                </div>

                <div className="space-y-5">
                  <InputField 
                    label="Nama Perusahaan" 
                    value={company.name}
                    onChange={(val) => setCompany({ ...company, name: val })}
                    icon={Building2}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      <MapPin size={14} className="inline mr-1.5" />
                      Alamat
                    </label>
                    <textarea
                      value={company.address}
                      onChange={(e) => setCompany({ ...company, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField 
                      label="Telepon" 
                      type="tel"
                      value={company.phone}
                      onChange={(val) => setCompany({ ...company, phone: val })}
                      icon={Phone}
                    />
                    <InputField 
                      label="Email" 
                      type="email"
                      value={company.email}
                      onChange={(val) => setCompany({ ...company, email: val })}
                      icon={Mail}
                    />
                  </div>

                  <InputField 
                    label="Website" 
                    value={company.website}
                    onChange={(val) => setCompany({ ...company, website: val })}
                    icon={Globe}
                  />
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">Pengaturan Notifikasi</h2>
                  <p className="text-sm text-zinc-400 mt-1">Kelola preferensi notifikasi Anda</p>
                </div>

                <div className="space-y-3">
                  {notificationItems.map((item) => (
                    <div 
                      key={item.key} 
                      className="flex items-center justify-between p-4 bg-zinc-800/30 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-zinc-200">{item.label}</p>
                        <p className="text-sm text-zinc-500 mt-0.5">{item.desc}</p>
                      </div>
                      <div className="ml-4">
                        <ToggleSwitch 
                          enabled={notifications[item.key as keyof typeof notifications]}
                          onChange={() => setNotifications({ 
                            ...notifications, 
                            [item.key]: !notifications[item.key as keyof typeof notifications]
                          })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">Keamanan</h2>
                  <p className="text-sm text-zinc-400 mt-1">Kelola keamanan akun Anda</p>
                </div>

                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="p-6 border border-zinc-800 rounded-lg">
                    <h3 className="font-semibold text-zinc-200 mb-5">Ubah Password</h3>
                    <div className="space-y-5">
                      <div className="relative">
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Password Lama</label>
                        <div className="relative">
                          <input
                            type={showPasswords.old ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 pr-12 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                          />
                          <button
                            onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
                          >
                            {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Password Baru</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 pr-12 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                          />
                          <button
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
                          >
                            {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Konfirmasi Password Baru</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 pr-12 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                          />
                          <button
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
                          >
                            {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors text-sm">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Two Factor */}
                  <div className="p-6 border border-zinc-800 rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-zinc-200">Two-Factor Authentication</h3>
                      <p className="text-sm text-zinc-500 mt-1">Tambahkan lapisan keamanan ekstra</p>
                    </div>
                    <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-lg transition-colors text-sm border border-zinc-700">
                      Aktifkan
                    </button>
                  </div>

                  {/* Sessions */}
                  <div className="p-6 border border-zinc-800 rounded-lg">
                    <h3 className="font-semibold text-zinc-200 mb-4">Sesi Aktif</h3>
                    <p className="text-sm text-zinc-500 mb-4">Kelola perangkat yang sedang login</p>
                    <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <Check size={18} className="text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200">Windows - Chrome</p>
                          <p className="text-xs text-zinc-500">Sesi saat ini</p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-400 font-medium px-3 py-1 bg-emerald-500/10 rounded-full">Aktif</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">Pengaturan Sistem</h2>
                  <p className="text-sm text-zinc-400 mt-1">Konfigurasi sistem aplikasi</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Bahasa</label>
                    <select
                      value={system.language}
                      onChange={(e) => setSystem({ ...system, language: e.target.value })}
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    >
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Zona Waktu</label>
                    <select
                      value={system.timezone}
                      onChange={(e) => setSystem({ ...system, timezone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    >
                      <option value="Asia/Jakarta">WIB (UTC+7)</option>
                      <option value="Asia/Makassar">WITA (UTC+8)</option>
                      <option value="Asia/Jayapura">WIT (UTC+9)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Format Tanggal</label>
                    <select
                      value={system.dateFormat}
                      onChange={(e) => setSystem({ ...system, dateFormat: e.target.value })}
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Batas Stok Rendah (kg)</label>
                    <input
                      type="number"
                      value={system.lowStockThreshold}
                      onChange={(e) => setSystem({ ...system, lowStockThreshold: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Database Info */}
                <div className="p-6 border border-zinc-800 rounded-lg">
                  <h3 className="font-semibold text-zinc-200 mb-5">Informasi Database</h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-zinc-500">Tipe Database</p>
                      <p className="font-medium text-zinc-200 mt-1">MongoDB Atlas</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Status</p>
                      <p className="font-medium text-emerald-400 flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Terhubung
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Versi API</p>
                      <p className="font-medium text-zinc-200 mt-1">v1.0.0</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Terakhir Sync</p>
                      <p className="font-medium text-zinc-200 mt-1">Hari ini, 14:30</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}