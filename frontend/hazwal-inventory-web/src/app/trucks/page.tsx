// ===== src/app/trucks/page.tsx =====
'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Download, CheckCircle, AlertCircle } from 'lucide-react';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import { truckService, type Truck, type CreateTruckInput } from '@/services/truckService';
import { useStore } from '@/stores/useStore';
import { reportService } from '@/services/reportService';
import toast from 'react-hot-toast';
import PageLoader from '@/components/PageLoader';

export default function TrucksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { trucks, setTrucks, addTruck, removeTruck } = useStore();

  const [formData, setFormData] = useState<CreateTruckInput>({
    truckNumber: '',
    capacity: 0,
    capacityUnit: 'Kg',
    driver: '',
    driverPhone: '',
  });

  useEffect(() => {
    loadTrucks();
  }, []);

  const loadTrucks = async () => {
    try {
      setPageLoading(true);
      const data = await truckService.getAll();
      setTrucks(data);
    } catch (error) {
      toast.error('Gagal memuat data kendaraan');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingId) {
        await truckService.update(editingId, formData);
        toast.success('Kendaraan berhasil diperbarui');
      } else {
        const newTruck = await truckService.create(formData);
        addTruck(newTruck);
        toast.success('Kendaraan berhasil ditambahkan');
      }

      setModalOpen(false);
      setEditingId(null);
      setFormData({
        truckNumber: '',
        capacity: 0,
        capacityUnit: 'Kg',
        driver: '',
        driverPhone: '',
      });
      loadTrucks();
    } catch (error) {
      toast.error('Gagal menyimpan kendaraan');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (truck: Truck) => {
    setEditingId(truck.id);
    setFormData({
      truckNumber: truck.truckNumber,
      capacity: truck.capacity,
      capacityUnit: truck.capacityUnit,
      driver: truck.driver,
      driverPhone: truck.driverPhone,
    });
    setModalOpen(true);
  };

  const handleDelete = async (truck: Truck) => {
    if (confirm('Apakah Anda yakin ingin menghapus kendaraan ini?')) {
      try {
        await truckService.delete(truck.id);
        removeTruck(truck.id);
        toast.success('Kendaraan berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus kendaraan');
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await reportService.downloadTrucksPDF();
      toast.success('PDF berhasil diunduh');
    } catch (error) {
      toast.error('Gagal mengunduh PDF');
    }
  };

  const filteredTrucks = trucks.filter(
    (t) =>
      t.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.driver?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'InUse':
        return 'bg-blue-500/20 text-blue-400';
      case 'Maintenance':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-zinc-600/50 text-zinc-300';
    }
  };

  return (
    <PageLoader isLoading={pageLoading}>
      <div className="flex flex-col" style={{ gap: '2.5rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Manajemen Kendaraan</h1>
            <p className="text-zinc-400 mt-1">Kelola fleet kendaraan pengiriman</p>
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
              setEditingId(null);
              setFormData({
                truckNumber: '',
                capacity: 0,
                capacityUnit: 'Kg',
                driver: '',
                driverPhone: '',
              });
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
            style={{ padding: '12px 24px' }}
          >
            <Plus size={18} />
            <span>Tambah Kendaraan</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50">
          <div style={{ padding: '20px 24px' }}>
            <p className="text-sm font-medium text-zinc-400">Total Kendaraan</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">{trucks.length}</p>
          </div>
        </div>
        <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50">
          <div style={{ padding: '20px 24px' }}>
            <p className="text-sm font-medium text-zinc-400">Tersedia</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {trucks.filter((t) => t.status === 'Available').length}
            </p>
          </div>
        </div>
        <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50">
          <div style={{ padding: '20px 24px' }}>
            <p className="text-sm font-medium text-zinc-400">Dalam Perbaikan</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {trucks.filter((t) => t.status === 'Maintenance').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Cari nomor kendaraan atau driver..."
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
            { header: 'No. Kendaraan', key: 'truckNumber' },
            { header: 'Driver', key: 'driver' },
            { header: 'Kontak', key: 'driverPhone' },
            { header: 'Kapasitas', key: 'capacity', render: (val, row) => `${val} ${row.capacityUnit}` },
            {
              header: 'Status',
              key: 'status',
              render: (status) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                  {status}
                </span>
              ),
            },
            {
              header: 'Maintenance',
              key: 'nextMaintenanceDate',
              render: (date) => new Date(date).toLocaleDateString('id-ID'),
            },
          ]}
          data={filteredTrucks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        title={editingId ? 'Edit Kendaraan' : 'Tambah Kendaraan'}
        onClose={() => setModalOpen(false)}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">No. Plat Kendaraan</label>
            <input
              type="text"
              placeholder="Contoh: B 1234 AB"
              value={formData.truckNumber}
              onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Kapasitas</label>
              <input
                type="number"
                placeholder="Masukkan kapasitas"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Satuan</label>
              <select
                value={formData.capacityUnit}
                onChange={(e) => setFormData({ ...formData, capacityUnit: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              >
                <option value="Kg">Kg</option>
                <option value="Liter">Liter</option>
                <option value="Ton">Ton</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Nama Driver</label>
            <input
              type="text"
              placeholder="Masukkan nama driver"
              value={formData.driver}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">No. Telepon Driver</label>
            <input
              type="tel"
              placeholder="Masukkan nomor telepon"
              value={formData.driverPhone}
              onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              required
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
              {loading ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>
      </div>
    </PageLoader>
  );
}
