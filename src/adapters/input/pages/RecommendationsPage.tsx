import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageShell } from '../components/PageShell';

interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'pending' | 'applied' | 'rejected';
  impact: string;
}

const categories = ['irrigation', 'plague', 'nutrition', 'weed', 'harvest'] as const;

const mockRecommendations: Recommendation[] = [
  { id: '1', category: 'irrigation', title: 'Optimizar riego por goteo', description: 'Reduce la frecuencia de riego en parcelas con papa nativa. La humedad del suelo está al 70%, puedes espaciar los riegos cada 4 días.', status: 'pending', impact: 'Ahorro de 30% de agua' },
  { id: '2', category: 'plague', title: 'Monitoreo de gorgojo de los Andes', description: 'Se ha detectado un incremento en la actividad del gorgojo en la región de Chupaca. Aplica control biológico con Bacillus thuringiensis.', status: 'pending', impact: 'Reduce pérdidas hasta 40%' },
  { id: '3', category: 'nutrition', title: 'Fertilización nitrogenada', description: 'Los cultivos de maíz en etapa de crecimiento requieren nitrógeno adicional. Aplica 120 kg/ha de urea.', status: 'pending', impact: 'Incrementa rendimiento 25%' },
  { id: '4', category: 'weed', title: 'Control de malezas post-emergente', description: 'Se recomienda realizar deshierbe manual en parcelas de quinua antes de que las malezas compitan por nutrientes.', status: 'applied', impact: 'Mejora calidad del cultivo' },
  { id: '5', category: 'harvest', title: 'Preparación para cosecha de cebada', description: 'La cebada en parcela El Retiro está en etapa de maduración. Prepara cosecha para los próximos 15 días.', status: 'pending', impact: 'Cosecha en tiempo óptimo' },
  { id: '6', category: 'irrigation', title: 'Riego adicional por sequía', description: 'Las precipitaciones están 30% por debajo del promedio. Incrementa riego en parcelas de cultivo sensible.', status: 'rejected', impact: 'Evita estrés hídrico' },
];

const categoryColors: Record<string, string> = {
  irrigation: 'bg-blue-100 text-blue-700',
  plague: 'bg-red-100 text-red-700',
  nutrition: 'bg-purple-100 text-purple-700',
  weed: 'bg-green-100 text-green-700',
  harvest: 'bg-amber-100 text-amber-700',
};

const statusBadge: Record<string, string> = {
  pending: 'badge-amber',
  applied: 'badge-green',
  rejected: 'bg-gray-100 text-gray-500',
};

export const RecommendationsPage = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [recommendations, setRecommendations] = useState(mockRecommendations);

  const filtered = activeCategory === 'all' ? recommendations : recommendations.filter((r) => r.category === activeCategory);

  const updateStatus = (id: string, status: 'applied' | 'rejected') => {
    setRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <PageShell title={t('recommendations.title')} subtitle={t('recommendations.description')}>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${activeCategory === 'all' ? 'bg-agro-secondary text-white shadow-sm' : 'border border-agro-border/60 text-agro-text-secondary hover:border-agro-text-secondary/30'}`}
        >Todas</button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${activeCategory === cat ? 'bg-agro-secondary text-white shadow-sm' : 'border border-agro-border/60 text-agro-text-secondary hover:border-agro-text-secondary/30'}`}
          >
            {t(`recommendations.categories.${cat}`)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-agro-muted text-2xl text-agro-text-secondary">*</div>
          <p className="mt-4 text-sm text-agro-text-secondary">{t('recommendations.empty')}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((rec) => (
            <div key={rec.id} className={`card-hover overflow-hidden ${rec.status === 'applied' ? 'border-green-200 bg-green-50/30' : rec.status === 'rejected' ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between bg-agro-muted/50 px-5 py-2.5">
                <span className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${categoryColors[rec.category] || 'bg-gray-100 text-gray-600'}`}>
                  {t(`recommendations.categories.${rec.category}`)}
                </span>
                <span className={`text-[11px] font-semibold ${statusBadge[rec.status]}`}>
                  {rec.status === 'pending' ? 'Pendiente' : rec.status === 'applied' ? 'Aplicada' : 'Rechazada'}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-agro-text">{rec.title}</h3>
                <p className="mt-2 text-xs text-agro-text-secondary leading-relaxed">{rec.description}</p>
                <div className="mt-3 text-[11px] font-medium text-agro-primary">{rec.impact}</div>
                {rec.status === 'pending' && (
                  <div className="mt-4 flex gap-2 border-t border-agro-border/30 pt-3">
                    <button onClick={() => updateStatus(rec.id, 'applied')} className="btn-primary text-[11px] px-4 py-1.5">Aplicar</button>
                    <button onClick={() => updateStatus(rec.id, 'rejected')} className="btn-outline text-[11px] px-4 py-1.5">Rechazar</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
};
