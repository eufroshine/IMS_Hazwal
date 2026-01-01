// ===== src/app/dashboard/page.tsx =====
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Package, Truck, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { chemicalService, type Chemical } from '@/services/chemicalService';
import { truckService, type Truck as TruckType } from '@/services/truckService';
import { deliveryService, type Delivery } from '@/services/deliveryService';
import { useStore } from '@/stores/useStore';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageLoader from '@/components/PageLoader';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [lowStockChemicals, setLowStockChemicals] = useState<Chemical[]>([]);
  const { chemicals, setChemicals, trucks, setTrucks, deliveries, setDeliveries } = useStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [chemicalData, truckData, deliveryData, lowStockData] = await Promise.all([
          chemicalService.getAll(),
          truckService.getAll(),
          deliveryService.getAll(),
          chemicalService.getLowStock(),
        ]);

        setChemicals(chemicalData);
        setTrucks(truckData);
        setDeliveries(deliveryData);
        setLowStockChemicals(lowStockData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setChemicals, setTrucks, setDeliveries]);

  const totalValue = chemicals.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const availableTrucks = trucks.filter((t) => t.status === 'Available').length;
  const completedDeliveries = deliveries.filter((d) => d.status === 'Completed').length;

  // Prepare chart data - group deliveries by month
  const chartData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentYear = new Date().getFullYear();
    
    // Initialize all months with 0
    const monthlyData = monthNames.map((name, index) => ({
      name,
      selesai: 0,
      pengiriman: 0,
      terjadwal: 0,
    }));

    // Count deliveries by month and status
    deliveries.forEach((delivery) => {
      const date = new Date(delivery.deliveryDate);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        if (delivery.status === 'Completed') {
          monthlyData[monthIndex].selesai += 1;
        } else if (delivery.status === 'OnDelivery') {
          monthlyData[monthIndex].pengiriman += 1;
        } else if (delivery.status === 'Scheduled') {
          monthlyData[monthIndex].terjadwal += 1;
        }
      }
    });

    return monthlyData;
  }, [deliveries]);

  return (
    <PageLoader isLoading={loading}>
      <div className="flex flex-col" style={{ gap: '2.5rem' }}>
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Kelola inventori bahan kimia Anda</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" style={{ gap: '1.5rem', rowGap: '2rem' }}>
          {/* Total Bahan Kimia */}
          <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 hover:border-zinc-500 transition-all min-w-0">
            <div style={{ padding: '20px 24px' }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 flex-shrink-0">
                  <Package size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-400 mb-1">Total Bahan Kimia</p>
                  <h3 className="text-2xl font-bold text-zinc-100">{chemicals.length}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Nilai Stok */}
          <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 hover:border-zinc-500 transition-all min-w-0">
            <div style={{ padding: '20px 24px' }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                  <TrendingUp size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-400 mb-1">Nilai Stok</p>
                  <h3 className="text-2xl font-bold text-zinc-100 truncate">Rp {totalValue.toLocaleString('id-ID')}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Kendaraan Tersedia */}
          <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 hover:border-zinc-500 transition-all min-w-0">
            <div style={{ padding: '20px 24px' }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
                  <Truck size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-400 mb-1">Kendaraan Tersedia</p>
                  <h3 className="text-2xl font-bold text-zinc-100">{availableTrucks}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Pengiriman Selesai */}
          <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 hover:border-zinc-500 transition-all min-w-0">
            <div style={{ padding: '20px 24px' }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                  <CheckCircle2 size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-400 mb-1">Pengiriman Selesai</p>
                  <h3 className="text-2xl font-bold text-zinc-100">{completedDeliveries}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Stok Rendah */}
          <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 hover:border-zinc-500 transition-all min-w-0">
            <div style={{ padding: '20px 24px' }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-500/20 text-red-400 flex-shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-400 mb-1">Stok Rendah</p>
                  <h3 className="text-2xl font-bold text-zinc-100">{lowStockChemicals.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-zinc-700/30 rounded-xl border border-zinc-600/50">
            <div style={{ padding: '24px' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-zinc-100">Aktivitas Pengiriman</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-zinc-400">Selesai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-zinc-400">Pengiriman</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-zinc-400">Terjadwal</span>
                  </div>
                </div>
              </div>
              
              {/* Fixed: Explicit width and height */}
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#a1a1aa', fontSize: 12 }}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#27272a', 
                        border: '1px solid #3f3f46', 
                        borderRadius: '8px',
                        color: '#f4f4f5'
                      }}
                      cursor={{ fill: 'rgba(63, 63, 70, 0.3)' }}
                    />
                    <Bar dataKey="selesai" name="Selesai" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pengiriman" name="Pengiriman" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="terjadwal" name="Terjadwal" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50">
            <div style={{ padding: '24px' }}>
              <h2 className="text-lg font-semibold text-zinc-100 mb-6">Status Pengiriman</h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                  {(() => {
                    const total = deliveries.length || 1;
                    const completed = deliveries.filter(d => d.status === 'Completed').length;
                    const onDelivery = deliveries.filter(d => d.status === 'OnDelivery').length;
                    const scheduled = deliveries.filter(d => d.status === 'Scheduled').length;
                    
                    const circumference = 2 * Math.PI * 40; // ~251.33
                    const completedPercent = (completed / total) * 100;
                    const onDeliveryPercent = (onDelivery / total) * 100;
                    const scheduledPercent = (scheduled / total) * 100;
                    
                    const completedDash = (completedPercent / 100) * circumference;
                    const onDeliveryDash = (onDeliveryPercent / 100) * circumference;
                    const scheduledDash = (scheduledPercent / 100) * circumference;
                    
                    const completedOffset = 0;
                    const onDeliveryOffset = -completedDash;
                    const scheduledOffset = -(completedDash + onDeliveryDash);
                    
                    return (
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#3f3f46" strokeWidth="8"/>
                        {completed > 0 && (
                          <circle 
                            cx="50" cy="50" r="40" 
                            fill="none" 
                            stroke="#3b82f6" 
                            strokeWidth="8" 
                            strokeDasharray={`${completedDash} ${circumference}`}
                            strokeDashoffset={completedOffset}
                            strokeLinecap="round"
                          />
                        )}
                        {onDelivery > 0 && (
                          <circle 
                            cx="50" cy="50" r="40" 
                            fill="none" 
                            stroke="#f59e0b" 
                            strokeWidth="8" 
                            strokeDasharray={`${onDeliveryDash} ${circumference}`}
                            strokeDashoffset={onDeliveryOffset}
                            strokeLinecap="round"
                          />
                        )}
                        {scheduled > 0 && (
                          <circle 
                            cx="50" cy="50" r="40" 
                            fill="none" 
                            stroke="#10b981" 
                            strokeWidth="8" 
                            strokeDasharray={`${scheduledDash} ${circumference}`}
                            strokeDashoffset={scheduledOffset}
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                    );
                  })()}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-zinc-100">{deliveries.length}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-zinc-400">Completed</span>
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">{completedDeliveries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-zinc-400">On Delivery</span>
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">{deliveries.filter(d => d.status === 'OnDelivery').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-zinc-400">Scheduled</span>
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">{deliveries.filter(d => d.status === 'Scheduled').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Recent Deliveries */}
          <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50">
            <div style={{ padding: '24px' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-zinc-100">Pengiriman Terbaru</h2>
                <a href="/pengiriman" className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                  Lihat Semua
                  <ArrowRight size={16} />
                </a>
              </div>
              <div className="space-y-3">
                {deliveries.slice(0, 5).map((delivery) => (
                  <div
                    key={delivery.id}
                    className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-700/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-200">{delivery.deliveryNumber}</p>
                      <p className="text-xs text-zinc-500 mt-1">{delivery.chemicalName}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                        delivery.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : delivery.status === 'OnDelivery'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-zinc-600/50 text-zinc-300'
                      }`}
                    >
                      {delivery.status === 'Completed' ? 'Selesai' : delivery.status === 'OnDelivery' ? 'Pengiriman' : 'Tertunda'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Truck Status */}
          <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50">
            <div style={{ padding: '24px' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-zinc-100">Status Kendaraan</h2>
                <a href="/manajemen-kendaraan" className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                  Lihat Semua
                  <ArrowRight size={16} />
                </a>
              </div>
              <div className="space-y-3">
                {trucks.slice(0, 5).map((truck) => (
                  <div
                    key={truck.id}
                    className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-700/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-200">{truck.truckNumber}</p>
                      <p className="text-xs text-zinc-500 mt-1">{truck.driver}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                        truck.status === 'Available'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : truck.status === 'InUse'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block"
                        style={{
                          backgroundColor:
                            truck.status === 'Available'
                              ? '#10b981'
                              : truck.status === 'InUse'
                              ? '#3b82f6'
                              : '#f59e0b',
                        }}
                      ></span>
                      {truck.status === 'Available' ? 'Tersedia' : truck.status === 'InUse' ? 'Dalam Penggunaan' : 'Maintenance'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLoader>
  );
}