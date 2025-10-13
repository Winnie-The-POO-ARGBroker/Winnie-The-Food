import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewRecipeStore } from '../../new-recipe.store';

@Component({
  selector: 'app-step-basic-info',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './step-basic-info.html',
  styleUrl: './step-basic-info.css'
})
export class StepBasicInfo {
  store = inject(NewRecipeStore);

  async onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Máx 5MB'); return; }
    const dataUrl = await fileToDataUrl(file);
    this.store.setImageDataUrl(dataUrl);
  }

  updateName(ev: Event)        { this.store.setName((ev.target as HTMLInputElement).value); }
  updateDescription(ev: Event) { this.store.setDescription((ev.target as HTMLTextAreaElement).value); }
  updateCategory(ev: Event)    { this.store.setCategory((ev.target as HTMLSelectElement).value); }
  updateDifficulty(ev: Event)  { this.store.setDifficulty((ev.target as HTMLSelectElement).value); }
  updatePrepMinutes(ev: Event) { this.store.setPrepMinutes(toNumber((ev.target as HTMLInputElement).value)); }
  updateCookMinutes(ev: Event) { this.store.setCookMinutes(toNumber((ev.target as HTMLInputElement).value)); }
  updateServings(ev: Event)    { this.store.setServings(toNumber((ev.target as HTMLInputElement).value)); }
  updateTags(ev: Event)        { this.store.setTags((ev.target as HTMLInputElement).value); }

  addNutrition()                   { this.store.addNutrition(); }
  removeNutrition(i: number)       { this.store.removeNutrition(i); }
  editNutLabel(i: number, e: Event){ this.store.updateNutLabel(i, (e.target as HTMLInputElement).value); }
  editNutValue(i: number, e: Event){ this.store.updateNutValue(i, (e.target as HTMLInputElement).value); }
  editNutUnit (i: number, e: Event){ this.store.updateNutUnit(i, (e.target as HTMLInputElement).value); }

  persistDraft() { this.store.persistDraft(); }
}

function toNumber(v: string): number | null {
  const n = Number((v ?? '').toString().trim());
  return Number.isFinite(n) ? n : null;
}
function fileToDataUrl(file: File) {
  return new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
