import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured.html',
  styleUrl: './featured.css'
})
export class Featured {
  @Input() recipes: any[] = [];
}
