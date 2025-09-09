import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecipes } from './dashboard-recipes';

describe('DashboardRecipes', () => {
  let component: DashboardRecipes;
  let fixture: ComponentFixture<DashboardRecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRecipes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRecipes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
