import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dificultadNombre', standalone: true })
export class DificultadNombrePipe implements PipeTransform {
  transform(value: 'facil'|'medio'|'dificil'|string): string {
    const v = String(value || '').toLowerCase();
    if (v === 'facil')   return 'Fácil';
    if (v === 'medio')   return 'Medio';
    if (v === 'dificil') return 'Difícil';
    return v.charAt(0).toUpperCase() + v.slice(1);
  }
}
