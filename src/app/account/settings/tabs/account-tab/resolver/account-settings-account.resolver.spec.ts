import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { accountSettingsAccountResolver } from './account-settings-account.resolver';

describe('accountSettingsAccountResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => accountSettingsAccountResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
