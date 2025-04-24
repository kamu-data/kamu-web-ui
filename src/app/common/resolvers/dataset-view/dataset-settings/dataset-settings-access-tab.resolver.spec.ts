import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { datasetSettingsAccessTabResolver } from './dataset-settings-access-tab.resolver';

describe('datasetSettingsAccessTabResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => datasetSettingsAccessTabResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
