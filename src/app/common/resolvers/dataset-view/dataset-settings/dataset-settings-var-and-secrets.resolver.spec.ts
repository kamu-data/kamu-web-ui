import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { datasetSettingsVarAndSecretsResolver } from './dataset-settings-var-and-secrets.resolver';

describe('datasetSettingsVarAndSecretsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => datasetSettingsVarAndSecretsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
