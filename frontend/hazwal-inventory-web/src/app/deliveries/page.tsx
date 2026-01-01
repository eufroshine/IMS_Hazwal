// ===== src/app/deliveries/page.tsx =====
'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Download, Calendar } from 'lucide-react';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import { deliveryService, type Delivery, type CreateDeliveryInput } from '@/services/deliveryService';
import { chemicalService, type Chemical } from '@/services/chemicalService';
import { truckService, type Truck } from '@/services/truckService';
import { useStore } from '@/stores/useStore';
import { reportService } from '@/services/reportService';
import toast from 'react-hot-toast';
import PageLoader from '@/components/PageLoader';

export default function DeliveriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [availableTrucks, setAvailableTrucks] = useState<Truck[]>([]);
  const [assignedTruckIds, setAssignedTruckIds] = useState<string[]>([]);
  const [allowSameDayMultiple, setAllowSameDayMultiple] = useState<boolean>(false);
  const { deliveries, setDeliveries, addDelivery, removeDelivery } = useStore();

  const [formData, setFormData] = useState<CreateDeliveryInput>({
    deliveryDate: new Date().toISOString().split('T')[0],
    chemicalStockId: '',
    quantity: 0,
    destination: '',
    truckIds: [],
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // When modal opens or delivery date changes, fetch assigned trucks for that date
    if (modalOpen) {
      fetchAssignedTrucksForDate(formData.deliveryDate);
    }
  }, [modalOpen, formData.deliveryDate]);

  const fetchAssignedTrucksForDate = async (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const start = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
      const end = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59));

      // fetch config flag
      try {
        const cfgRes = await fetch('/api/config');
        if (cfgRes.ok) {
          const cfg = await cfgRes.json();
          setAllowSameDayMultiple(Boolean(cfg.allowSameDayMultipleAssignments));
        }
      } catch (e) {
        // ignore, keep default
      }

      const deliveriesOnDate = await deliveryService.getByDateRange(start.toISOString(), end.toISOString());
      const ids = deliveriesOnDate.flatMap((d) => d.truckAssignments?.map((t) => t.truckId) ?? []);
      setAssignedTruckIds(Array.from(new Set(ids)));
    } catch (error) {
      console.error('Failed to fetch assigned trucks for date', error);
      setAssignedTruckIds([]);
    }
  };

  const loadData = async () => {
    try {
      setPageLoading(true);
      const [deliveryData, chemicalData, truckData] = await Promise.all([
        deliveryService.getAll(),
        chemicalService.getAll(),
        truckService.getAvailable(),
      ]);

      setDeliveries(deliveryData);
      setChemicals(chemicalData);
      setAvailableTrucks(truckData);
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const newDelivery = await deliveryService.create(formData);
      addDelivery(newDelivery);
      toast.success('Pengiriman berhasil dibuat');

      setModalOpen(false);
      setFormData({
        deliveryDate: new Date().toISOString().split('T')[0],
        chemicalStockId: '',
        quantity: 0,
        destination: '',
        truckIds: [],
        notes: '',
      });
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat pengiriman');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (deliveryId: string, newStatus: string) => {
    try {
      await deliveryService.updateStatus(deliveryId, newStatus);
      toast.success(`Status diubah menjadi ${getStatusLabel(newStatus)}`);
      loadData();
    } catch (error) {
      toast.error('Gagal mengubah status');
    }
  };

  const handleDelete = async (delivery: Delivery) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengiriman ini?')) {
      try {
        await deliveryService.delete(delivery.id);
        removeDelivery(delivery.id);
        toast.success('Pengiriman berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus pengiriman');
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await reportService.downloadDeliveriesPDF();
      toast.success('PDF berhasil diunduh');
    } catch (error) {
      toast.error('Gagal mengunduh PDF');
    }
  };

  const filteredDeliveries = deliveries.filter(
    (d) =>
      d.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.chemicalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'OnDelivery':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Scheduled':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-zinc-600/50 text-zinc-300 border-zinc-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'Terjadwal';
      case 'OnDelivery':
        return 'Dalam Pengiriman';
      case 'Completed':
        return 'Selesai';
      case 'Cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <PageLoader isLoading={pageLoading}>
      <div className="flex flex-col" style={{ gap: '2.5rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Manajemen Pengiriman</h1>
            <p className="text-zinc-400 mt-1">Kelola jadwal dan status pengiriman bahan kimia</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
            className="inline-flex items-center gap-3 bg-zinc-700 text-zinc-100 rounded-xl hover:bg-zinc-600 transition-colors"
            style={{ padding: '12px 24px' }}
          >
            <Download size={18} />
            <span>Unduh PDF</span>
          </button>
          <button
            onClick={() => {
              setFormData({
                deliveryDate: new Date().toISOString().split('T')[0],
                chemicalStockId: '',
                quantity: 0,
                destination: '',
                truckIds: [],
                notes: '',
              });
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
            style={{ padding: '12px 24px' }}
          >
            <Plus size={18} />
            <span>Buat Pengiriman</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50">
          <div style={{ padding: '20px 24px' }}>
            <p className="text-sm font-medium text-zinc-400">Total Pengiriman</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">{deliveries.length}</p>
          </div>
        </div>
        <div className="bg-zinc-700/30 rounded-xl border border-amber-500/30">
          <div style={{ padding: '20px 24px' }}>
            <p className="text-sm font-medium text-amber-400">Terjadwal</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {deliveries.filter((d) => d.status === 'Scheduled').length}
            </p>
          </div>
        </div>
        <div className="bg-zinc-700/30 rounded-xl border border-blue-500/30">
          <div style={{ padding: '20px 24px' }}>
            <p className="text-sm font-medium text-blue-400">Dalam Pengiriman</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {deliveries.filter((d) => d.status === 'OnDelivery').length}
            </p>
          </div>
        </div>
        <div className="bg-zinc-700/30 rounded-xl border border-emerald-500/30">
          <div style={{ padding: '20px 24px' }}>
            <p className="text-sm font-medium text-emerald-400">Selesai</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {deliveries.filter((d) => d.status === 'Completed').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Cari no. pengiriman atau bahan kimia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 pr-12 py-3 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={20} />
      </div>

      {/* Table */}
      <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 overflow-hidden">
        <Table
          columns={[
            { header: 'No. Pengiriman', key: 'deliveryNumber' },
            {
              header: 'Tanggal',
              key: 'deliveryDate',
              render: (date) => new Date(date).toLocaleDateString('id-ID'),
            },
            { header: 'Bahan Kimia', key: 'chemicalName' },
            { header: 'Jumlah', key: 'quantity', render: (val, row) => `${val} ${row.unit}` },
            { header: 'Tujuan', key: 'destination' },
            { header: 'Truk (No.)', key: 'truckAssignments', render: (assigns) => (assigns && assigns.length ? assigns.map((a:any) => a.truckNumber).join(', ') : '-') },
            { header: 'Driver', key: 'truckAssignments', render: (assigns) => (assigns && assigns.length ? assigns.map((a:any) => a.driver).join(', ') : '-') },
            {
              header: 'Status',
              key: 'status',
              render: (status, row) => (
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(row.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-zinc-700 border-zinc-600 text-zinc-100`}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="OnDelivery">On Delivery</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              ),
            },
          ]}
          data={filteredDeliveries}
          onEdit={() => {}}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        title="Buat Pengiriman Baru"
        onClose={() => setModalOpen(false)}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Tanggal Pengiriman</label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Bahan Kimia</label>
              <select
                value={formData.chemicalStockId}
                onChange={(e) => setFormData({ ...formData, chemicalStockId: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                required
              >
                <option value="">-- Pilih Bahan Kimia --</option>
                {chemicals.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.quantity} {c.unit})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Jumlah</label>
            <input
              type="number"
              placeholder="Masukkan jumlah"
              value={formData.quantity || ''}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value === '' ? 0 : parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Tujuan Pengiriman</label>
            <input
              type="text"
              placeholder="Masukkan alamat tujuan"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Pilih Kendaraan</label>
            <div className="space-y-2 max-h-40 overflow-y-auto bg-zinc-700/30 border border-zinc-600 rounded-xl p-3">
              {availableTrucks.map((truck) => {
                const isAssigned = assignedTruckIds.includes(truck.id);
                const isDisabled = isAssigned && !allowSameDayMultiple;
                return (
                  <label
                    key={truck.id}
                    className={`flex items-center gap-3 ${isDisabled ? 'text-zinc-500 cursor-not-allowed' : 'text-zinc-300 hover:text-zinc-100'}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.truckIds.includes(truck.id)}
                      disabled={isDisabled}
                      onChange={(e) => {
                        if (isDisabled) return;
                        if (e.target.checked) {
                          setFormData({ ...formData, truckIds: [...formData.truckIds, truck.id] });
                        } else {
                          setFormData({
                            ...formData,
                            truckIds: formData.truckIds.filter((id) => id !== truck.id),
                          });
                        }
                      }}
                      className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-blue-500 focus:ring-blue-500/50"
                    />
                    <span className="text-sm">
                      {truck.truckNumber} - {truck.driver} ({truck.capacity} {truck.capacityUnit})
                    </span>
                    {isAssigned && (
                      <span className={`ml-auto text-xs ${isDisabled ? 'text-amber-400' : 'text-yellow-300'}`}>
                        {isDisabled ? 'Sudah dipakai pada tanggal ini' : 'Dipakai juga pada tanggal ini (diizinkan)'}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Catatan</label>
            <textarea
              placeholder="Masukkan catatan"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end" style={{ marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="inline-flex items-center justify-center bg-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-600 transition-colors"
              style={{ padding: '10px 18px' }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50"
              style={{ padding: '10px 18px' }}
            >
              {loading ? 'Membuat...' : 'Buat Pengiriman'}
            </button>
          </div>
        </form>
      </Modal>
      </div>
    </PageLoader>
  );
}