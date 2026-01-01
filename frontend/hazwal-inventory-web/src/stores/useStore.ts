// ===== src/stores/useStore.ts =====
import { create } from 'zustand';
import { Chemical } from '@/services/chemicalService';
import { Truck } from '@/services/truckService';
import { Delivery } from '@/services/deliveryService';

interface Store {
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Chemical State
  chemicals: Chemical[];
  setChemicals: (chemicals: Chemical[]) => void;
  addChemical: (chemical: Chemical) => void;
  removeChemical: (id: string) => void;

  // Truck State
  trucks: Truck[];
  setTrucks: (trucks: Truck[]) => void;
  addTruck: (truck: Truck) => void;
  removeTruck: (id: string) => void;

  // Delivery State
  deliveries: Delivery[];
  setDeliveries: (deliveries: Delivery[]) => void;
  addDelivery: (delivery: Delivery) => void;
  removeDelivery: (id: string) => void;
  // User profile
  profile: {
    name: string;
    email: string;
    role?: string;
    phone?: string;
  };
  setProfile: (profile: { name: string; email: string; role?: string }) => void;
  updateProfile: (patch: Partial<{ name: string; email: string; role?: string }>) => void;
  loadProfileFromStorage: () => void;
}

export const useStore = create<Store>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  chemicals: [],
  setChemicals: (chemicals) => set({ chemicals }),
  addChemical: (chemical) => set((state) => ({ chemicals: [...state.chemicals, chemical] })),
  removeChemical: (id) => set((state) => ({ chemicals: state.chemicals.filter((c) => c.id !== id) })),

  trucks: [],
  setTrucks: (trucks) => set({ trucks }),
  addTruck: (truck) => set((state) => ({ trucks: [...state.trucks, truck] })),
  removeTruck: (id) => set((state) => ({ trucks: state.trucks.filter((t) => t.id !== id) })),

  deliveries: [],
  setDeliveries: (deliveries) => set({ deliveries }),
  addDelivery: (delivery) => set((state) => ({ deliveries: [...state.deliveries, delivery] })),
  removeDelivery: (id) => set((state) => ({ deliveries: state.deliveries.filter((d) => d.id !== id) })),
  // User profile with persistence
  profile: {
    name: 'Admin',
    email: 'admin@hazwal.com',
    role: 'Administrator',
    phone: '+62 812 3456 7890',
  },
  setProfile: (profile) => {
    set({ profile });
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hazwal_profile', JSON.stringify(profile));
      }
    } catch {}
  },
  updateProfile: (patch) => set((state) => {
    const profile = { ...state.profile, ...patch };
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hazwal_profile', JSON.stringify(profile));
      }
    } catch {}
    return { profile };
  }),
  loadProfileFromStorage: () => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('hazwal_profile');
        if (raw) {
          const profile = JSON.parse(raw);
          set({ profile });
        }
      }
    } catch {}
  },
}));