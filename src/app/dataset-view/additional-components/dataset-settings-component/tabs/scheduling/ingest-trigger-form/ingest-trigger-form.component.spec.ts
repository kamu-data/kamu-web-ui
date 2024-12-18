import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestTriggerFormComponent } from './ingest-trigger-form.component';

describe('IngestTriggerFormComponent', () => {
  let component: IngestTriggerFormComponent;
  let fixture: ComponentFixture<IngestTriggerFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngestTriggerFormComponent]
    });
    fixture = TestBed.createComponent(IngestTriggerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
