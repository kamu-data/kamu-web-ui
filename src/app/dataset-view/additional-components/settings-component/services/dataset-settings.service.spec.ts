import { TestBed } from '@angular/core/testing';

import { DatasetSettingsService } from './dataset-settings.service';

describe('DatasetSettingsService', () => {
  let service: DatasetSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
