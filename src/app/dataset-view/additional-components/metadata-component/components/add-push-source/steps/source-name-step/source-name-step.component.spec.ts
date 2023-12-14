import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceNameStepComponent } from './source-name-step.component';

describe('SourceNameStepComponent', () => {
  let component: SourceNameStepComponent;
  let fixture: ComponentFixture<SourceNameStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceNameStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceNameStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
