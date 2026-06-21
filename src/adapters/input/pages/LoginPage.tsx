import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@shared/store/auth/authStore';
import { RoutePaths } from '@shared/constants/routePaths';

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate(RoutePaths.home);
    else setError(t('auth.loginError'));
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
            <p className="mt-1 text-xs text-agro-text-secondary">{t('auth.loginTitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="contraseña"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-secondary w-full">
              {loading ? 'Ingresando...' : t('auth.login')}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-agro-text-secondary">
            {t('auth.noAccount')}{' '}
            <Link to={RoutePaths.register} className="font-semibold text-agro-secondary hover:underline">
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
