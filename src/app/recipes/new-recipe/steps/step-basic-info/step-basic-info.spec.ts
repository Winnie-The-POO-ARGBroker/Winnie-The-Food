import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepBasicInfo } from './step-basic-info';

describe('StepBasicInfo', () => {
  let component: StepBasicInfo;
  let fixture: ComponentFixture<StepBasicInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepBasicInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepBasicInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
