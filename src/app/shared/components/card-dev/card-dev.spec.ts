import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDev } from './card-dev';

describe('CardDev', () => {
  let component: CardDev;
  let fixture: ComponentFixture<CardDev>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDev]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDev);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
