import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { flowDetailsActiveTabResolver } from './flow-details-active-tab.resolver';

describe('flowDetailsActiveTabResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => flowDetailsActiveTabResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
