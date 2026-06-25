import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCropsStore, CropType, CropStatus } from '@shared/store/crops/cropsStore';
import { useParcelsStore } from '@shared/store/parcels/parcelsStore';
import { PageShell } from '../components/PageShell';
import { NasaSatelliteMap } from '../components/NasaSatelliteMap'; // Importación de la NASA
import { AiChatWindow } from '../components/AiChatWindow'; // Importación de la IA

const cropTypes = ['potato', 'corn', 'quinoa', 'barley', 'bean', 'coffee', 'maca', 'oat'] as const;
const statusBadge: Record<CropStatus, string> = {
  sowing: 'badge-blue', growth: 'badge-green', maturation: 'badge-amber', harvested: 'bg-gray-100 text-gray-600',
};

const DEFAULT_COORDS = { lat: -12.0833, lng: -75.2167 };

export const CropsPage = () => {
  const { t } = useTranslation();
  const { crops, addCrop, updateCrop, deleteCrop } = useCropsStore();
  const parcels = useParcelsStore((s) => s.parcels);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ parcelId: '', parcelName: '', type: 'potato' as CropType, sowingDate: '', status: 'sowing' as CropStatus, notes: '' });

  // Estado para enviarle el contexto dinámico del cultivo a la IA
  const [cropAiContext, setCropAiContext] = useState<string | undefined>(undefined);

  // Efecto para actualizar el asesoramiento de la IA según lo que el usuario esté editando o seleccionando
  useEffect(() => {
    if (form.parcelId) {
      const selectedParcel = parcels.find(p => p.id === form.parcelId);
      const days = form.sowingDate ? Math.floor((Date.now() - new Date(form.sowingDate).getTime()) / 86400000) : 0;
      setCropAiContext(
        `Hola Asistente. Necesito recomendaciones para mi cultivo de ${t(`crops.types.${form.type}`)} ubicado en la parcela ${selectedParcel?.name || 'técnica'}. Actualmente se encuentra en estado de ${t(`crops.statuses.${form.status}`)} y lleva ${days >= 0 ? days : 0} días desde que fue sembrado. ¿Cuáles son los cuidados de fertilización, control de plagas y riego sugeridos para esta etapa?`
      );
    } else {
      setCropAiContext("Actúa como un agrónomo experto. Bríndame consejos generales sobre la rotación de cultivos andinos y buenas prácticas de siembra para optimizar el rendimiento del suelo.");
    }
  }, [form.type, form.status, form.parcelId, form.sowingDate, parcels, t]);

  const resetForm = () => {
    setForm({ parcelId: '', parcelName: '', type: 'potato', sowingDate: '', status: 'sowing', notes: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parcel = parcels.find((p) => p.id === form.parcelId);
    const data = { ...form, parcelName: parcel?.name ?? '' };
    if (editingId) updateCrop(editingId, data);
    else addCrop(data);
    resetForm();
  };

  const handleEdit = (crop: typeof crops[0]) => {
    setForm({ parcelId: crop.parcelId, parcelName: crop.parcelName, type: crop.type, sowingDate: crop.sowingDate, status: crop.status, notes: crop.notes ?? '' });
    setEditingId(crop.id);
    setShowForm(true);
  };

  const daysSince = (date: string) => Math.floor((Date.now() - new Date(date).getTime()) / 86400000);

  // MAPEADO: Preparamos los cultivos registrados para proyectarlos en el mapa satelital de la NASA
  const mappedCropsForMap = crops
    .map((c) => {
      const associatedParcel = parcels.find((p) => p.id === c.parcelId);
      if (!associatedParcel) return null;
      return {
        id: c.id,
        name: `${t(`crops.types.${c.type}`)} (${c.parcelName})`,
        lat: associatedParcel.lat || DEFAULT_COORDS.lat,
        lng: associatedParcel.lng || DEFAULT_COORDS.lng,
        crop: `Estado: ${t(`crops.statuses.${c.status}`)} | ${daysSince(c.sowingDate)} días`,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // Si el usuario selecciona una parcela en el formulario, enfocamos el mapa en ese lote específico
  const currentSelectedParcel = parcels.find(p => p.id === form.parcelId);
  const mapCenter: [number, number] = currentSelectedParcel?.lat && currentSelectedParcel?.lng
    ? [currentSelectedParcel.lat, currentSelectedParcel.lng]
    : mappedCropsForMap.length > 0 
      ? [mappedCropsForMap[0].lat, mappedCropsForMap[0].lng] 
      : [DEFAULT_COORDS.lat, DEFAULT_COORDS.lng];

  return (
    <PageShell title={t('crops.title')} subtitle={t('crops.description')}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-agro-text-secondary">{crops.length} cultivos registrados</p>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-xs">+ {t('crops.newCrop')}</button>
      </div>

      {/* MAQUETADO DE DOS COLUMNAS: IZQUIERDA TABLA/FORMULARIO, DERECHA MAPA SATELITAL NASA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna de Gestión e Información */}
        <div className="lg:col-span-8 space-y-6">
          {showForm && (
            <div className="card p-6 border border-agro-border/40">
              <h3 className="section-title mb-5">{editingId ? 'Editar Cultivo' : 'Nuevo Cultivo'}</h3>
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('crops.parcel')}</label>
                  <select value={form.parcelId} onChange={(e) => setForm({ ...form, parcelId: e.target.value })} className="input-field" required>
                    <option value="">Seleccionar parcela</option>
                    {parcels.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('crops.type')}</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CropType })} className="input-field">
                    {cropTypes.map((ct) => <option key={ct} value={ct}>{t(`crops.types.${ct}`)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('crops.sowingDate')}</label>
                  <input type="date" value={form.sowingDate} onChange={(e) => setForm({ ...form, sowingDate: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-agro-text uppercase tracking-wider">{t('crops.status')}</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CropStatus })} className="input-field">
                    {(['sowing', 'growth', 'maturation', 'harvested'] as CropStatus[]).map((cs) => <option key={cs} value={cs}>{t(`crops.statuses.${cs}`)}</option>)}
                  </select>
                </div>
                <div className="flex items-end gap-3 sm:col-span-2">
                  <button type="submit" className="btn-secondary text-xs">Guardar</button>
                  <button type="button" onClick={resetForm} className="btn-outline text-xs">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {crops.length === 0 ? (
            <div className="card flex flex-col items-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-agro-muted text-2xl text-agro-text-secondary">~</div>
              <p className="mt-4 text-sm text-agro-text-secondary">{t('crops.empty')}</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-agro-muted/50">
                    <tr>
                      <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-agro-text-secondary">Tipo</th>
                      <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-agro-text-secondary">Parcela</th>
                      <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-agro-text-secondary">Siembra</th>
                      <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-agro-text-secondary">Días</th>
                      <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-agro-text-secondary">Estado</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-agro-border/30">
                    {crops.map((crop) => (
                      <tr key={crop.id} className="transition-colors hover:bg-agro-muted/20">
                        <td className="px-5 py-3.5 font-semibold text-agro-text">{t(`crops.types.${crop.type}`)}</td>
                        <td className="px-5 py-3.5 text-xs text-agro-text-secondary">{crop.parcelName}</td>
                        <td className="px-5 py-3.5 text-xs text-agro-text-secondary">{crop.sowingDate}</td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-agro-text">{daysSince(crop.sowingDate)}</span>
                          <span className="ml-1 text-xs text-agro-text-secondary">días</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[11px] font-semibold ${statusBadge[crop.status]}`}>{t(`crops.statuses.${crop.status}`)}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(crop)} className="btn-outline text-[11px] px-2.5 py-1">Editar</button>
                            <button onClick={() => { if (confirm(t('crops.confirmDelete'))) deleteCrop(crop.id); }} className="btn-danger text-[11px] px-2.5 py-1">Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ASISTENTE DE IA: Localizado abajo, alimentándose contextualmente de las acciones seleccionadas */}
          <div className="mt-4">
            <h2 className="text-sm font-bold text-agro-text mb-2">Asesoramiento de Cultivos Especializado (IA)</h2>
            <AiChatWindow key={cropAiContext} contextAlert={cropAiContext} />
          </div>
        </div>

        {/* Columna Derecha: Visor de Mosaicos de la NASA */}
        <div className="lg:col-span-4">
          <div className="sticky top-4">
            <NasaSatelliteMap parcels={mappedCropsForMap} center={mapCenter} />
          </div>
        </div>

      </div>
    </PageShell>
  );
};