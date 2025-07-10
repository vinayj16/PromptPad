import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color, trend }) => (
  <div className={`rounded-lg p-4 shadow-sm border border-gray-200 flex items-center space-x-4 bg-white dark:bg-gray-800`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${color}-100 text-${color}-600 dark:bg-${color}-900 dark:text-${color}-400`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
      {trend && <div className="text-xs text-green-500 mt-1">{trend}</div>}
    </div>
  </div>
);

export default StatsCard; 