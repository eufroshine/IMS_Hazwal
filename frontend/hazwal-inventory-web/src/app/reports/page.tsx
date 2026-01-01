// ===== src/app/reports/page.tsx =====
'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Truck, Package, RefreshCw, ArrowDownToLine } from 'lucide-react';
import { reportService } from '@/services/reportService';
import { chemicalService, type Chemical } from '@/services/chemicalService';
import { deliveryService, type Delivery } from '@/services/deliveryService';
import { truckService, type Truck as TruckType } from '@/services/truckService';
import toast from 'react-hot-toast';
import PageLoader from '@/components/PageLoader';

export default function ReportsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Load statistics on mount
  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setStatsLoading(true);
      const [chemicals, deliveries, trucks] = await Promise.all([
        chemicalService.getAll(),
        deliveryService.getAll(),
        truckService.getAll(),
      ]);

      const totalValue = chemicals.reduce((sum, c) => sum + c.price * c.quantity, 0);
      const completedDeliveries = deliveries.filter((d) => d.status === 'Completed').length;
      const availableTrucks = trucks.filter((t) => t.status === 'Available').length;

      setStats({
        totalChemicals: chemicals.length,
        totalValue,
        totalDeliveries: deliveries.length,
        completedDeliveries,
        totalTrucks: trucks.length,
        availableTrucks,
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDownload = async (type: 'chemicals' | 'deliveries' | 'trucks') => {
    try {
      setLoading(type);
      switch (type) {
        case 'chemicals':
          await reportService.downloadChemicalsPDF();
          toast.success('Laporan bahan kimia berhasil diunduh');
          break;
        case 'deliveries':
          await reportService.downloadDeliveriesPDF();
          toast.success('Laporan pengiriman berhasil diunduh');
          break;
        case 'trucks':
          await reportService.downloadTrucksPDF();
          toast.success('Laporan kendaraan berhasil diunduh');
          break;
      }
    } catch (error) {
      toast.error('Gagal mengunduh laporan');
    } finally {
      setLoading(null);
    }
  };

  const reports = [
    {
      id: 'chemicals',
      title: 'Bahan Kimia',
      description: 'Stok, harga & supplier',
      icon: Package,
      color: 'blue',
      stat: stats?.totalChemicals || 0,
      subStat: stats ? `Rp ${(stats.totalValue / 1000000).toFixed(1)}M` : '-',
    },
    {
      id: 'deliveries',
      title: 'Pengiriman',
      description: 'Status & riwayat',
      icon: ArrowDownToLine,
      color: 'emerald',
      stat: stats?.totalDeliveries || 0,
      subStat: stats ? `${stats.completedDeliveries} selesai` : '-',
    },
    {
      id: 'trucks',
      title: 'Kendaraan',
      description: 'Fleet & maintenance',
      icon: Truck,
      color: 'amber',
      stat: stats?.totalTrucks || 0,
      subStat: stats ? `${stats.availableTrucks} tersedia` : '-',
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: 'bg-blue-500/20 text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-500',
      text: 'text-blue-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'bg-emerald-500/20 text-emerald-400',
      button: 'bg-emerald-600 hover:bg-emerald-500',
      text: 'text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: 'bg-amber-500/20 text-amber-400',
      button: 'bg-amber-600 hover:bg-amber-500',
      text: 'text-amber-400',
    },
  };

  return (
    <PageLoader isLoading={statsLoading}>
      <div className="flex flex-col" style={{ gap: '2.5rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Laporan</h1>
            <p className="text-zinc-400 mt-1">Unduh laporan dalam format PDF</p>
          </div>
          <button
            onClick={loadStatistics}
            disabled={statsLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-700/50 border border-zinc-600 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={statsLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reports.map((report) => {
          const colors = colorClasses[report.color as keyof typeof colorClasses];
          const Icon = report.icon;
          const isLoading = loading === report.id;

          return (
            <div
              key={report.id}
              className={`relative overflow-hidden rounded-xl border ${colors.border} ${colors.bg} transition-all hover:scale-[1.02]`}
            >
              <div style={{ padding: '20px 24px' }}>
                {/* Content */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${colors.icon}`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${colors.text}`}>
                      {statsLoading ? '-' : report.stat}
                    </p>
                    <p className="text-xs text-zinc-500">{report.subStat}</p>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-zinc-100 mb-1">{report.title}</h3>
                <p className="text-sm text-zinc-500 mb-4">{report.description}</p>

                <button
                  onClick={() => handleDownload(report.id as 'chemicals' | 'deliveries' | 'trucks')}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg ${colors.button} transition-colors disabled:opacity-50`}
                >
                  <Download size={16} className={isLoading ? 'animate-bounce' : ''} />
                  {isLoading ? 'Mengunduh...' : 'Unduh PDF'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Format Info */}
        <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-600/50 rounded-lg">
              <FileText size={18} className="text-zinc-300" />
            </div>
            <h3 className="font-semibold text-zinc-100">Format Laporan</h3>
          </div>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              PDF dengan header PT. HAZWAL PERDANA MANDIRI
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Tabel data lengkap dengan format profesional
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              Timestamp dan footer ringkasan
            </li>
          </ul>
        </div>

        {/* Tips */}
        <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-600/50 rounded-lg">
              <span className="text-lg">💡</span>
            </div>
            <h3 className="font-semibold text-zinc-100">Tips</h3>
          </div>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-zinc-500 mt-0.5">•</span>
              <span>Gunakan laporan stok untuk monitoring dan restock planning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-500 mt-0.5">•</span>
              <span>Laporan pengiriman untuk tracking dan analisis performa</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-500 mt-0.5">•</span>
              <span>Simpan laporan sebagai dokumentasi perusahaan</span>
            </li>
          </ul>
        </div>
      </div>
      </div>
    </PageLoader>
  );
}