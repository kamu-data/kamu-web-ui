import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { datasetSettingsCompactionTabResolver } from './dataset-settings-compaction-tab.resolver';

describe('datasetSettingsCompactionTabResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => datasetSettingsCompactionTabResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
