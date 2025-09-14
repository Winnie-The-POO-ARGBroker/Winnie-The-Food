import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewRecipeStore } from '../../new-recipe.js';
import { Receta } from '../../../../models/receta-model.js';

@Component({
  selector: 'app-step-process-tips',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './step-process-tips.html',
  styleUrls: ['../../new-recipe.css', './step-process-tips.css'],
})
export class StepProcessTips {
  constructor(public store: NewRecipeStore, private router: Router) {}

  trackById = (_: number, item: { id: number }) => item.id;

  addStep(){ this.store.steps.update(list => [...list, { id: Date.now()+Math.random(), title:'', description:'' }]); }
  removeStep(i:number){ this.store.steps.update(list => list.filter((_,idx)=>idx!==i)); }
  editStepTitle(i:number, e:Event){
    this.store.steps.update(list => { const next=[...list]; next[i].title=(e.target as HTMLInputElement).value; return next; });
  }
  editStepDesc(i:number, e:Event){
    this.store.steps.update(list => { const next=[...list]; next[i].description=(e.target as HTMLTextAreaElement).value; return next; });
  }

  addTip(){ this.store.tips.update(list => [...list, { id: Date.now()+Math.random(), title:'', description:'' }]); }
  removeTip(i:number){ this.store.tips.update(list => list.filter((_,idx)=>idx!==i)); }
  editTipTitle(i:number, e:Event){
    this.store.tips.update(list => { const next=[...list]; next[i].title=(e.target as HTMLInputElement).value; return next; });
  }
  editTipDesc(i:number, e:Event){
    this.store.tips.update(list => { const next=[...list]; next[i].description=(e.target as HTMLTextAreaElement).value; return next; });
  }

  finalizarYVer(): void {
    const id = Date.now();

    const rawDiff = this.store.difficulty();
    const dificultad = (rawDiff === 'media' ? 'medio' : rawDiff) || 'facil';

    const receta: Receta = {
      id,
      autor_id: 0,
      nombre: this.store.name() || 'Receta sin nombre',
      descripcion: this.store.description() || '',
      porciones: this.store.servings() ?? 0,
      tiempoPrep: Number(this.store.prepMinutes()) || 0,
      tiempoCoc: Number(this.store.cookMinutes()) || 0,
      categoria: this.store.category() || 'Otros',
      dificultad: dificultad as any,
      tipo_comida: 'Casera',
      publicada: true,
      imageUrl: this.store.imageDataUrl() || '/assets/placeholder-recipe.webp',
      tags: (this.store.tags() || '').split(',').map(s => s.trim()).filter(Boolean),

      ingredients: this.store.ingredients().map(i =>
        [i.name, `${i.qty ?? ''}${i.unit ? ' ' + i.unit : ''}`.trim()]
          .filter(Boolean).join(' ')
      ),

      nutrition: this.store.nutritionItems()
        .filter(n => n.label && n.value)
        .map(n => ({ label: n.label, value: n.value, unit: n.unit })),

      steps: this.store.steps().map(s =>
        s.title ? `${s.title}: ${s.description ?? ''}` : (s.description ?? '')
      ),
      tips: this.store.tips().map(t =>
        t.title ? `${t.title}: ${t.description ?? ''}` : (t.description ?? '')
      ),

      related: [],
      enlace: `/detail-recipe/${id}`
    };

    const KEY = 'newRecipe.collection.v1';
    const current = JSON.parse(localStorage.getItem(KEY) || '[]');
    const next = [receta, ...current.filter((r: any) => String(r?.id) !== String(id))];
    localStorage.setItem(KEY, JSON.stringify(next));

    localStorage.removeItem('newRecipe.draft.v1');
    this.router.navigate(['/detail-recipe', id], { queryParams: { local: 1 }, replaceUrl: true });
  }
}
