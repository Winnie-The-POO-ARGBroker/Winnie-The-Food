import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecipeShell } from './new-recipe-shell';

describe('NewRecipeShell', () => {
  let component: NewRecipeShell;
  let fixture: ComponentFixture<NewRecipeShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRecipeShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRecipeShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
