import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { datasetSettingsIngestConfigurationResolver } from './dataset-settings-ingest-configuration.resolver';

describe('datasetSettingsIngestConfigurationResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => datasetSettingsIngestConfigurationResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
