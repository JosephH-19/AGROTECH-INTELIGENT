import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RoutePaths } from '@shared/constants/routePaths';
import { useAuthStore } from '@shared/store/auth/authStore';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: RoutePaths.home, labelKey: 'nav.home' },
  { path: RoutePaths.parcels, labelKey: 'nav.parcels' },
  { path: RoutePaths.crops, labelKey: 'nav.crops' },
  { path: RoutePaths.climate, labelKey: 'nav.climate' },
  { path: RoutePaths.alerts, labelKey: 'nav.alerts' },
  { path: RoutePaths.recommendations, labelKey: 'nav.recommendations' },
  { path: RoutePaths.reports, labelKey: 'nav.reports' },
  { path: RoutePaths.settings, labelKey: 'nav.settings' },
];

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate(RoutePaths.login);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-agro-bg via-white to-agro-bg/50">
      <nav className="sticky top-0 z-50 border-b border-agro-border/40 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link to={RoutePaths.home} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-agro-primary text-sm font-bold text-white shadow-sm">
              A
            </div>
            <span className="text-sm font-bold text-agro-text">{t('app.title')}</span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-agro-primary/10 text-agro-primary'
                      : 'text-agro-text-secondary hover:bg-agro-muted hover:text-agro-text'
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${
              isOnline ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </div>
            {user && (
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-agro-primary text-[10px] font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden text-xs text-agro-text-secondary sm:block">{user.name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-agro-danger transition-all hover:bg-red-50"
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-t border-agro-border/20 px-4 py-1.5 lg:hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-agro-primary/10 text-agro-primary'
                    : 'text-agro-text-secondary hover:bg-agro-muted'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
};
