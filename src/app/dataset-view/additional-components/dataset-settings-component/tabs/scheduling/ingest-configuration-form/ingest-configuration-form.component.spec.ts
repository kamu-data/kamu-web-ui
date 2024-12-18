import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestConfigurationFormComponent } from './ingest-configuration-form.component';

describe('IngestConfigurationFormComponent', () => {
  let component: IngestConfigurationFormComponent;
  let fixture: ComponentFixture<IngestConfigurationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngestConfigurationFormComponent]
    });
    fixture = TestBed.createComponent(IngestConfigurationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
