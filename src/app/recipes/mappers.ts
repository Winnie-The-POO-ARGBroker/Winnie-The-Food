// src/app/recipes/mappers.ts
import { RecetaDTO } from '../services/recipes.service';
import { FeaturedCard } from '../shared/components/featured/featured';

export function toFeaturedCard(r: RecetaDTO): FeaturedCard {
  const dif = String(r.dificultad ?? '').toLowerCase();
  const dificultad: FeaturedCard['dificultad'] =
    dif === '1' || dif === 'facil' ? 'facil'
    : (dif === '2' || dif === 'medio' || dif === 'media') ? 'medio'
    : 'dificil';

  const tiempo = ((r.tiempoPrep ?? 0) + (r.tiempoCoc ?? 0)) || 0;

  return {
    id: (r.id ?? crypto.randomUUID()) as string | number,
    titulo: r.nombre,
    descripcion: r.descripcion ?? '',
    imagen: r.imageUrl ?? (r as any).imagen ?? null,
    enlace: `/detail-recipe/${r.id ?? ''}`,
    tiempo: tiempo > 0 ? `${tiempo} min` : '—',
    dificultad
  };
}
