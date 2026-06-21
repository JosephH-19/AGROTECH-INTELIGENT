import { ReactNode } from 'react';

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const PageShell = ({ title, subtitle, children }: PageShellProps) => (
  <div className="space-y-6">
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-agro-primary to-agro-primary-dark px-6 py-5">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-white/80">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);
