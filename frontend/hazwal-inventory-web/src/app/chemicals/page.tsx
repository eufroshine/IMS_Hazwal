'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import { chemicalService, type Chemical, type CreateChemicalInput } from '@/services/chemicalService';
import { useStore } from '@/stores/useStore';
import { reportService } from '@/services/reportService';
import toast from 'react-hot-toast';
import PageLoader from '@/components/PageLoader';

export default function ChemicalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { chemicals, setChemicals, addChemical, removeChemical } = useStore();

  const [formData, setFormData] = useState<CreateChemicalInput>({
    name: '',
    formula: '',
    description: '',
    price: 0,
    quantity: 0,
    unit: 'Kg',
    minQuantity: 10,
    supplier: '',
    category: '',
  });

  useEffect(() => {
    loadChemicals();
  }, []);

  const loadChemicals = async () => {
    try {
      setPageLoading(true);
      const data = await chemicalService.getAll();
      setChemicals(data);
    } catch (error) {
      toast.error('Gagal memuat data bahan kimia');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingId) {
        await chemicalService.update(editingId, formData);
        toast.success('Bahan kimia berhasil diperbarui');
      } else {
        const newChemical = await chemicalService.create(formData);
        addChemical(newChemical);
        toast.success('Bahan kimia berhasil ditambahkan');
      }

      setModalOpen(false);
      setEditingId(null);
      resetForm();
      loadChemicals();
    } catch (error) {
      toast.error('Gagal menyimpan bahan kimia');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (chemical: Chemical) => {
    setEditingId(chemical.id);
    setFormData({
      name: chemical.name,
      formula: chemical.formula,
      description: chemical.description,
      price: chemical.price,
      quantity: chemical.quantity,
      unit: chemical.unit,
      minQuantity: chemical.minQuantity,
      supplier: chemical.supplier,
      category: chemical.category,
    });
    setModalOpen(true);
  };

  const handleDelete = async (chemical: Chemical) => {
    if (confirm('Apakah Anda yakin ingin menghapus bahan kimia ini?')) {
      try {
        await chemicalService.delete(chemical.id);
        removeChemical(chemical.id);
        toast.success('Bahan kimia berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus bahan kimia');
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await reportService.downloadChemicalsPDF();
      toast.success('PDF berhasil diunduh');
    } catch (error) {
      toast.error('Gagal mengunduh PDF');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      formula: '',
      description: '',
      price: 0,
      quantity: 0,
      unit: 'Kg',
      minQuantity: 10,
      supplier: '',
      category: '',
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    resetForm();
    setModalOpen(true);
  };

  const filteredChemicals = chemicals.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.formula?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLoader isLoading={pageLoading}>
      <div className="flex flex-col" style={{ gap: '2.5rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">Stok Bahan Kimia</h1>
            <p className="text-zinc-400 mt-2">Kelola inventori bahan kimia perusahaan</p>
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
            onClick={openAddModal}
            className="inline-flex items-center gap-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
            style={{ padding: '12px 24px' }}
          >
            <Plus size={18} />
            <span>Tambah Bahan</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Cari bahan kimia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 pr-12 py-3 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={20} />
      </div>

      {/* Table Container */}
      <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            columns={[
              { header: 'Nama', key: 'name' },
              { header: 'Formula', key: 'formula' },
              { header: 'Jumlah', key: 'quantity', render: (val, row) => `${val} ${row.unit}` },
              { header: 'Harga', key: 'price', render: (val) => `Rp ${val.toLocaleString('id-ID')}` },
              { header: 'Supplier', key: 'supplier' },
              { header: 'Kategori', key: 'category' },
            ]}
            data={filteredChemicals}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        title={editingId ? 'Edit Bahan Kimia' : 'Tambah Bahan Kimia'}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Nama Bahan Kimia</label>
              <input
                type="text"
                placeholder="Masukkan nama..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Rumus Kimia</label>
              <input
                type="text"
                placeholder="Contoh: H2O"
                value={formData.formula}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Harga per Unit</label>
              <input
                type="number"
                placeholder="Masukkan harga"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Jumlah</label>
              <input
                type="number"
                placeholder="Masukkan jumlah"
                value={formData.quantity || ''}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option value="Kg">Kg</option>
                <option value="Liter">Liter</option>
                <option value="Ton">Ton</option>
                <option value="Pcs">Pcs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Minimum Stok</label>
              <input
                type="number"
                placeholder="Masukkan minimum"
                value={formData.minQuantity || ''}
                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Supplier</label>
              <input
                type="text"
                placeholder="Masukkan nama supplier..."
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Kategori</label>
              <input
                type="text"
                placeholder="Masukkan kategori..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Deskripsi</label>
            <textarea
              placeholder="Masukkan deskripsi..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-3 justify-end" style={{ marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
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