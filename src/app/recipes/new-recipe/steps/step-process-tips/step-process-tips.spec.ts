import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepProcessTips } from './step-process-tips';

describe('StepProcessTips', () => {
  let component: StepProcessTips;
  let fixture: ComponentFixture<StepProcessTips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepProcessTips]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepProcessTips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
