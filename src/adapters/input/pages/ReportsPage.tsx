import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParcelsStore } from '@shared/store/parcels/parcelsStore';
import { useCropsStore } from '@shared/store/crops/cropsStore';
import { useAlertsStore } from '@shared/store/alerts/alertsStore';
import { useClimateStore } from '@shared/store/climate/climateStore';
import { PageShell } from '../components/PageShell';

type ReportType = 'climate' | 'production' | 'alerts' | 'general';
type ReportPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

function periodDays(period: ReportPeriod): number {
  switch (period) {
    case 'weekly': return 7;
    case 'monthly': return 30;
    case 'quarterly': return 90;
    case 'yearly': return 365;
  }
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildCsv(rows: string[][]): string {
  return rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
}

export const ReportsPage = () => {
  const { t } = useTranslation();
  const parcels = useParcelsStore((s) => s.parcels);
  const crops = useCropsStore((s) => s.crops);
  const alerts = useAlertsStore((s) => s.alerts);
  const climate = useClimateStore((s) => s.current);

  const [reportType, setReportType] = useState<ReportType>('general');
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('monthly');
  const [generating, setGenerating] = useState(false);

  const now = new Date().toISOString().slice(0, 10);

  const generateReport = useCallback(() => {
    const days = periodDays(reportPeriod);
    const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

    let title = '';
    let htmlRows: string[] = [];
    let csvRows: string[][] = [];

    switch (reportType) {
      case 'production': {
        title = 'Reporte de Producción';
        htmlRows.push('<h3 style="margin-bottom:8px;">Resumen de Parcelas</h3>');
        csvRows.push(['Parcela', 'Área (ha)', 'Estado', 'Cultivos']);
        parcels.forEach(p => {
          const pCrops = crops.filter(c => c.parcelId === p.id);
          const cropNames = pCrops.map(c => t(`crops.types.${c.type}`)).join(', ');
          htmlRows.push(`<p><strong>${p.name}</strong> — ${p.area} ha — ${t(`parcels.${p.health}`)}${cropNames ? ` — Cultivos: ${cropNames}` : ''}</p>`);
          csvRows.push([p.name, String(p.area), t(`parcels.${p.health}`), cropNames]);
        });
        const totalArea = parcels.reduce((s, p) => s + p.area, 0);
        htmlRows.push(`<p style="margin-top:12px;font-weight:bold;">Área total: ${totalArea.toFixed(1)} ha</p>`);
        break;
      }
      case 'climate': {
        title = 'Reporte Climático';
        htmlRows.push(`<p><strong>Temperatura actual:</strong> ${climate?.temp ?? '--'}°C</p>`);
        htmlRows.push(`<p><strong>Humedad:</strong> ${climate?.humidity ?? '--'}%</p>`);
        htmlRows.push(`<p><strong>Precipitación:</strong> ${climate?.precipitation ?? '--'} mm</p>`);
        htmlRows.push(`<p><strong>Viento:</strong> ${climate?.wind ?? '--'} km/h</p>`);
        htmlRows.push(`<p><strong>Índice UV:</strong> ${climate?.uvIndex ?? '--'}</p>`);
        csvRows.push(['Métrica', 'Valor']);
        csvRows.push(['Temperatura', `${climate?.temp ?? '--'}°C`]);
        csvRows.push(['Humedad', `${climate?.humidity ?? '--'}%`]);
        csvRows.push(['Precipitación', `${climate?.precipitation ?? '--'} mm`]);
        csvRows.push(['Viento', `${climate?.wind ?? '--'} km/h`]);
        csvRows.push(['Índice UV', `${climate?.uvIndex ?? '--'}`]);
        break;
      }
      case 'alerts': {
        title = 'Reporte de Alertas';
        const filtered = alerts.filter(a => a.createdAt >= since);
        htmlRows.push(`<p>Alertas desde ${since}: ${filtered.length}</p>`);
        csvRows.push(['Título', 'Severidad', 'Tipo', 'Leída', 'Fecha']);
        filtered.forEach(a => {
          htmlRows.push(`<p><strong>${a.title}</strong> — ${t(`alerts.severities.${a.severity}`)} — ${a.read ? 'Leída' : 'Pendiente'} — ${a.createdAt.slice(0, 10)}</p>`);
          csvRows.push([a.title, t(`alerts.severities.${a.severity}`), a.type, a.read ? 'Sí' : 'No', a.createdAt.slice(0, 10)]);
        });
        break;
      }
      default: {
        title = 'Reporte General';
        htmlRows.push(`<h3 style="margin-bottom:8px;">Resumen del Sistema</h3>`);
        htmlRows.push(`<p>Parcelas: ${parcels.length}</p>`);
        htmlRows.push(`<p>Cultivos activos: ${crops.filter(c => c.status !== 'harvested').length}</p>`);
        htmlRows.push(`<p>Alertas sin leer: ${alerts.filter(a => !a.read).length}</p>`);
        htmlRows.push(`<p>Temperatura actual: ${climate?.temp ?? '--'}°C</p>`);
        csvRows.push(['Métrica', 'Valor']);
        csvRows.push(['Parcelas', String(parcels.length)]);
        csvRows.push(['Cultivos activos', String(crops.filter(c => c.status !== 'harvested').length)]);
        csvRows.push(['Alertas sin leer', String(alerts.filter(a => !a.read).length)]);
        csvRows.push(['Temperatura', `${climate?.temp ?? '--'}°C`]);
        break;
      }
    }

    return { title, htmlRows, csvRows };
  }, [parcels, crops, alerts, climate, reportType, reportPeriod, t]);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 400));
    const { title } = generateReport();
    if (title) {
      const report = {
        id: Date.now().toString(),
        type: reportType,
        period: reportPeriod,
        title,
        date: now,
      };
      setReports(prev => [report, ...prev]);
    }
    setGenerating(false);
  };

  const [reports, setReports] = useState<Array<{ id: string; type: ReportType; period: ReportPeriod; title: string; date: string }>>([]);

  const handleDownload = (format: 'csv' | 'pdf') => {
    const { title, htmlRows, csvRows } = generateReport();
    const dateStr = now.replace(/-/g, '');
    const filename = `${title.replace(/\s+/g, '_')}_${dateStr}`;

    if (format === 'csv') {
      download(`${filename}.csv`, buildCsv(csvRows), 'text/csv');
    } else {
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>
body{font-family:sans-serif;padding:40px;color:#222;}h1{color:#2E7D32;}h3{margin-top:20px;}p{margin:4px 0;line-height:1.5;}
.footer{margin-top:40px;font-size:12px;color:#888;border-top:1px solid #ddd;padding-top:12px;}
</style></head><body>
<h1>${title}</h1>
<p style="color:#666;margin-bottom:20px;">Generado el ${new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
${htmlRows.join('\n')}
<div class="footer">AgroTech Inteligente — Reporte generado desde la plataforma</div>
</body></html>`;
      download(`${filename}.html`, html, 'text/html');
    }
  };

  return (
    <PageShell title={t('reports.title')} subtitle={t('reports.description')}>
      <div className="card p-6">
        <h3 className="section-title mb-5">Generar Reporte</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-agro-text-secondary">Tipo</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value as ReportType)} className="input-field">
              {(['climate', 'production', 'alerts', 'general'] as ReportType[]).map((rt) => <option key={rt} value={rt}>{t(`reports.types.${rt}`)}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-agro-text-secondary">Período</label>
            <select value={reportPeriod} onChange={(e) => setReportPeriod(e.target.value as ReportPeriod)} className="input-field">
              {(['weekly', 'monthly', 'quarterly', 'yearly'] as ReportPeriod[]).map((rp) => <option key={rp} value={rp}>{t(`reports.periods.${rp}`)}</option>)}
            </select>
          </div>
          <button onClick={handleGenerate} disabled={generating} className="btn-secondary text-xs">
            {generating ? 'Generando...' : 'Generar Reporte'}
          </button>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="card flex flex-col items-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-agro-muted text-2xl text-agro-text-secondary">=</div>
          <p className="mt-4 text-sm text-agro-text-secondary">{t('reports.empty')}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-agro-muted/50">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-agro-text-secondary">Tipo</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-agro-text-secondary">Período</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-agro-text-secondary">Fecha</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-agro-border/30">
                {reports.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-agro-muted/20">
                    <td className="px-5 py-3.5 font-semibold text-agro-text">{t(`reports.types.${r.type}`)}</td>
                    <td className="px-5 py-3.5 text-xs text-agro-text-secondary">{t(`reports.periods.${r.period}`)}</td>
                    <td className="px-5 py-3.5 text-xs text-agro-text-secondary">{r.date}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => handleDownload('pdf')} className="btn-outline text-[11px] px-3 py-1">PDF</button>
                        <button onClick={() => handleDownload('csv')} className="btn-outline text-[11px] px-3 py-1">CSV</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageShell>
  );
};
