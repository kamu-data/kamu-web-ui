import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { datasetSettingsSchedulingTabResolver } from './dataset-settings-scheduling-tab.resolver';

describe('datasetSettingsSchedulingTabResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => datasetSettingsSchedulingTabResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
