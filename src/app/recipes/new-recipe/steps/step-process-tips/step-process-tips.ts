import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewRecipeStore } from '../../new-recipe.js';

@Component({
  selector: 'app-step-process-tips',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './step-process-tips.html',
  styleUrls: ['../../new-recipe.css', './step-process-tips.css'],
})
export class StepProcessTips {
  constructor(public store: NewRecipeStore) {}

  addStep(){ this.store.steps.update(list => [...list, { title:'', description:'' }]); }
  editStep(i:number, patch: any){
    this.store.steps.update(list => { const next=[...list]; next[i]={...next[i],...patch}; return next; });
  }
  addTip(){ this.store.tips.update(list => [...list, { title:'', description:'' }]); }
  editTip(i:number, patch:any){
    this.store.tips.update(list => { const next=[...list]; next[i]={...next[i],...patch}; return next; });
  }
}
