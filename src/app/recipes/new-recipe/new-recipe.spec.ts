import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecipe } from './new-recipe';

describe('NewRecipe', () => {
  let component: NewRecipe;
  let fixture: ComponentFixture<NewRecipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRecipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRecipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
