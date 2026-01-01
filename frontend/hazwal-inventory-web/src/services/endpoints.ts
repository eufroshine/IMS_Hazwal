// ===== src/services/endpoints.ts =====
export const ENDPOINTS = {
  // Chemicals
  CHEMICALS: {
    LIST: '/chemicals',
    GET: (id: string) => `/chemicals/${id}`,
    CREATE: '/chemicals',
    UPDATE: (id: string) => `/chemicals/${id}`,
    DELETE: (id: string) => `/chemicals/${id}`,
    LOW_STOCK: '/chemicals/low-stock',
  },

  // Trucks
  TRUCKS: {
    LIST: '/trucks',
    GET: (id: string) => `/trucks/${id}`,
    CREATE: '/trucks',
    UPDATE: (id: string) => `/trucks/${id}`,
    DELETE: (id: string) => `/trucks/${id}`,
    AVAILABLE: '/trucks/available',
    UPDATE_STATUS: (id: string) => `/trucks/${id}/status`,
  },

   // Deliveries
  DELIVERIES: {
    LIST: '/deliveries',
    GET: (id: string) => `/deliveries/${id}`,
    CREATE: '/deliveries',
    UPDATE_STATUS: (id: string) => `/deliveries/${id}/status`,
    DELETE: (id: string) => `/deliveries/${id}`,
    DATE_RANGE: '/deliveries/date-range',
  },

  // Reports
  REPORTS: {
    CHEMICALS_PDF: '/reports/chemicals/pdf',
    DELIVERIES_PDF: '/reports/deliveries/pdf',
    TRUCKS_PDF: '/reports/trucks/pdf',
  },
};