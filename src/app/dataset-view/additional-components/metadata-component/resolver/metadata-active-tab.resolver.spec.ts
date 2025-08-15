import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { metadataActiveTabResolver } from './metadata-active-tab.resolver';

describe('metadataActiveTabResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => metadataActiveTabResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
