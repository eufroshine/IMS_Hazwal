// ===== src/components/StatCard.tsx =====
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-500/20 text-blue-400',
  green: 'bg-emerald-500/20 text-emerald-400',
  yellow: 'bg-amber-500/20 text-amber-400',
  red: 'bg-red-500/20 text-red-400',
};

const iconBgClasses = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
}: StatCardProps) {
  return (
    <div 
      className="bg-zinc-700/30 rounded-xl border border-zinc-600/50 hover:border-zinc-500 transition-all duration-200"
    >
      <div className="m-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-400 truncate">{title}</p>
            <h3 className="text-2xl lg:text-3xl font-bold text-zinc-100 mt-2 truncate">{value}</h3>
            {subtitle && (
              <p className="text-xs text-zinc-500 mt-2 truncate">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className={`p-3 rounded-xl ${colorClasses[color]} flex-shrink-0`}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}