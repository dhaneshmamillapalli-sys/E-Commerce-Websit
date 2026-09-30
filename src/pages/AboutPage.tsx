import React from 'react';
import { Store, ShieldCheck, Zap, Award, Users, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div id="about-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          Production Architecture & Engineering
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          About ApexMart Platform
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          ApexMart is an enterprise-ready, high-performance full-stack MERN e-commerce application designed to demonstrate industrial software engineering best practices, seamless Stripe payments, real-time JWT authentication, and interactive analytics.
        </p>
      </div>

      {/* Tech Stack Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold">
            ⚡
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Full-Stack React & Node</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Built using Vite, React 19, TypeScript, and Express REST APIs with modular architecture for ultra-fast page speed and zero layout shifts.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
            🔒
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">JWT & Stripe Security</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Stateless JWT cookies, password hashing via bcrypt, role-based access control (RBAC), and 256-bit SSL encrypted Stripe gateway handling.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
            📊
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Live Analytics Suite</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Interactive Recharts data visualizers tracking monthly revenue trajectories, category volume distributions, and inventory threshold alerts.
          </p>
        </div>
      </div>
    </div>
  );
};
