import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepIngredients } from './step-ingredients';

describe('StepIngredients', () => {
  let component: StepIngredients;
  let fixture: ComponentFixture<StepIngredients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepIngredients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepIngredients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
