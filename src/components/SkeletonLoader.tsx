import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div id="product-skeleton" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 animate-pulse">
      <div className="w-full h-56 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2"></div>
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr id="table-skeleton-row" className="animate-pulse border-b border-slate-200 dark:border-slate-800">
      <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div></td>
      <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div></td>
      <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div></td>
      <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div></td>
      <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12"></div></td>
    </tr>
  );
};
