import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchingTriggerFormComponent } from './batching-trigger-form.component';

describe('BatchingTriggerFormComponent', () => {
  let component: BatchingTriggerFormComponent;
  let fixture: ComponentFixture<BatchingTriggerFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BatchingTriggerFormComponent]
    });
    fixture = TestBed.createComponent(BatchingTriggerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
