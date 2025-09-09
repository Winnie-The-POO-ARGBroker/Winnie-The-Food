import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRecipe } from './detail-recipe';

describe('DetailRecipe', () => {
  let component: DetailRecipe;
  let fixture: ComponentFixture<DetailRecipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailRecipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailRecipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
