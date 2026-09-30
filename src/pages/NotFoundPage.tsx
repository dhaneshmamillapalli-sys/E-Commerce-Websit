import React from 'react';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div id="not-found-page" className="max-w-md mx-auto my-20 p-8 text-center space-y-4">
      <h1 className="text-6xl font-black text-indigo-600">404</h1>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Page Not Found</h2>
      <p className="text-xs text-slate-500">The requested page or route does not exist.</p>
      <button
        onClick={() => onNavigate('home')}
        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto"
      >
        <Home className="w-4 h-4" /> Return to Home
      </button>
    </div>
  );
};
