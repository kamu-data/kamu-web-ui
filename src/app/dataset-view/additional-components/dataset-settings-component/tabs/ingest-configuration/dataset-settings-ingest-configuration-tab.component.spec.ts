import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetSettingsIngestConfigurationTabComponent } from './dataset-settings-ingest-configuration-tab.component';

describe('DatasetSettingsIngestConfigurationTabComponent', () => {
  let component: DatasetSettingsIngestConfigurationTabComponent;
  let fixture: ComponentFixture<DatasetSettingsIngestConfigurationTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetSettingsIngestConfigurationTabComponent]
    });
    fixture = TestBed.createComponent(DatasetSettingsIngestConfigurationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
