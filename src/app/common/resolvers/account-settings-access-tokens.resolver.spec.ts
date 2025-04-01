import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { accountSettingsAccessTokensResolver } from './account-settings-access-tokens.resolver';

describe('accountSettingsAccessTokensResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => accountSettingsAccessTokensResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
