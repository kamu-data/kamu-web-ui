import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { accountActiveTabResolver } from './account-active-tab.resolver';

describe('accountActiveTabResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => accountActiveTabResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
