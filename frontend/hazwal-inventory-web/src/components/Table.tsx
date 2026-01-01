// ===== src/components/Table.tsx =====
'use client';

import React from 'react';

interface Column<T> {
  header: string;
  key: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function Table<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 p-16 text-center">
        <div className="text-zinc-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-zinc-400 text-base">Tidak ada data untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-800/50 border-b border-zinc-600/50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={`${String(col.key)}-${idx}`}
                  className="px-8 py-5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-700/50">
            {data.map((row) => (
              <tr 
                key={row.id} 
                className="hover:bg-zinc-700/30 transition-colors duration-150"
              >
                {columns.map((col, idx) => (
                  <td key={`${String(col.key)}-${idx}`} className="px-8 py-5 text-zinc-200">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}