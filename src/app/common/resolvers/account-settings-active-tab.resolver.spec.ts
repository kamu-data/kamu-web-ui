import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { accountSettingsActiveTabResolver } from './account-settings-active-tab.resolver';

describe('accountSettingsActiveTabResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => accountSettingsActiveTabResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
