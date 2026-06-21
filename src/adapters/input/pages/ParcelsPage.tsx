import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParcelsStore, Parcel } from '@shared/store/parcels/parcelsStore';
import { PageShell } from '../components/PageShell';

const soilTypes = ['clay', 'loam', 'sandy', 'silt'] as const;
const healthBadge = {
  good: 'badge-green',
  warning: 'badge-amber',
  critical: 'badge-red',
};

export const ParcelsPage = () => {
  const { t } = useTranslation();
  const { parcels, addParcel, updateParcel, deleteParcel } = useParcelsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', area: 0, soilType: 'loam' as Parcel['soilType'], province: '', district: '', lat: 0, lng: 0, health: 'good' as Parcel['health'] });

  const resetForm = () => {
    setForm({ name: '', area: 0, soilType: 'loam', province: '', district: '', lat: 0, lng: 0, health: 'good' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateParcel(editingId, form);
    else addParcel(form);
    resetForm();
  };

  const handleEdit = (parcel: Parcel) => {
    setForm({ name: parcel.name, area: parcel.area, soilType: parcel.soilType, province: parcel.province, district: parcel.district, lat: parcel.lat, lng: parcel.lng, health: parcel.health });
    setEditingId(parcel.id);
    setShowForm(true);
  };

  return (
    <PageShell title={t('parcels.title')} subtitle={t('parcels.description')}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-agro-text-secondary">{parcels.length} parcelas registradas</p>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-xs">
          + {t('parcels.newParcel')}
        </button>
      </div>

      {showForm && (
        <div className="card p-6">
          <h3 className="section-title mb-5">{editingId ? 'Editar Parcela' : 'Nueva Parcela'}</h3>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('parcels.name')}</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('parcels.area')}</label>
              <input type="number" step="0.1" value={form.area} onChange={(e) => setForm({ ...form, area: +e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('parcels.soilType')}</label>
              <select value={form.soilType} onChange={(e) => setForm({ ...form, soilType: e.target.value as Parcel['soilType'] })} className="input-field">
                {soilTypes.map((s) => <option key={s} value={s}>{t(`parcels.soilTypes.${s}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('parcels.province')}</label>
              <input type="text" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('parcels.district')}</label>
              <input type="text" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('parcels.lat')}</label>
              <input type="number" step="0.0001" value={form.lat} onChange={(e) => setForm({ ...form, lat: +e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('parcels.lng')}</label>
              <input type="number" step="0.0001" value={form.lng} onChange={(e) => setForm({ ...form, lng: +e.target.value })} className="input-field" />
            </div>
            <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-3">
              <button type="submit" className="btn-secondary text-xs">Guardar</button>
              <button type="button" onClick={resetForm} className="btn-outline text-xs">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {parcels.length === 0 ? (
        <div className="card flex flex-col items-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-agro-muted text-2xl text-agro-text-secondary">~</div>
          <p className="mt-4 text-sm text-agro-text-secondary">{t('parcels.empty')}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {parcels.map((parcel) => (
            <div key={parcel.id} className="card-hover p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-agro-text">{parcel.name}</h3>
                  <p className="text-xs text-agro-text-secondary">{parcel.area} ha</p>
                </div>
                <span className={`text-[11px] font-semibold ${healthBadge[parcel.health]}`}>
                  {t(`parcels.${parcel.health}`)}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-[11px] text-agro-text-secondary">
                <p>Suelo: {t(`parcels.soilTypes.${parcel.soilType}`)}</p>
                <p>Ubicación: {parcel.province}, {parcel.district}</p>
                <p>Coords: {parcel.lat}, {parcel.lng}</p>
              </div>
              <div className="mt-4 flex gap-2 border-t border-agro-border/30 pt-3">
                <button onClick={() => handleEdit(parcel)} className="btn-outline text-[11px] px-3 py-1.5">Editar</button>
                <button onClick={() => { if (confirm(t('parcels.confirmDelete'))) deleteParcel(parcel.id); }} className="btn-danger text-[11px] px-3 py-1.5">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
};
