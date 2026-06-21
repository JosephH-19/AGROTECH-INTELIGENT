import { useTranslation } from 'react-i18next';
import { PageShell } from '../components/PageShell';

export const OfflineSyncPage = () => {
  const { t } = useTranslation();

  return (
    <PageShell title={t('offlineSync.title')}>
      <p className="mt-4 max-w-2xl text-slate-600">{t('offlineSync.description')}</p>
    </PageShell>
  );
};
