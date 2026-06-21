import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore, UserRole } from '@shared/store/auth/authStore';
import { RoutePaths } from '@shared/constants/routePaths';

const roles: { key: UserRole; labelKey: string }[] = [
  { key: 'farmer', labelKey: 'auth.farmer' },
  { key: 'cooperative', labelKey: 'auth.cooperative' },
  { key: 'ngo', labelKey: 'auth.ngo' },
  { key: 'government', labelKey: 'auth.government' },
  { key: 'admin', labelKey: 'auth.admin' },
];

export const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'farmer' as UserRole });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await register(form);
    setLoading(false);
    if (ok) navigate(RoutePaths.home);
    else setError(t('auth.registerError'));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-agro-bg via-white to-agro-bg/70 px-4">
      <div className="w-full max-w-sm">
        <div className="card p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-agro-primary shadow-sm">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <h1 className="text-lg font-bold text-agro-text">{t('app.title')}</h1>
            <p className="mt-1 text-xs text-agro-text-secondary">{t('auth.registerTitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('auth.name')}</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Juan Pérez" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('auth.email')}</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="correo@ejemplo.com" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('auth.password')}</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="contraseña" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('auth.phone')}</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="999 888 777" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('auth.role')}</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.key })}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      form.role === r.key
                        ? 'border-agro-primary bg-agro-primary/5 text-agro-primary'
                        : 'border-agro-border/60 text-agro-text-secondary hover:border-agro-text-secondary/30'
                    }`}
                  >
                    {t(r.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}

            <button type="submit" disabled={loading} className="btn-secondary w-full">
              {loading ? 'Registrando...' : t('auth.register')}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-agro-text-secondary">
            {t('auth.hasAccount')}{' '}
            <Link to={RoutePaths.login} className="font-semibold text-agro-secondary hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
