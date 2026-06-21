import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageShell } from '../components/PageShell';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <PageShell title={t('notFound.title')}>
      <p className="mt-4 max-w-2xl text-slate-600">{t('notFound.description')}</p>
      <Link to="/" className="mt-6 inline-block text-teal-700 hover:underline">
        {t('notFound.homeLink')}
      </Link>
    </PageShell>
  );
};
