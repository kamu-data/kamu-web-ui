import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { metadataSchemaTabResolver } from './metadata-schema-tab.resolver';

describe('metadataSchemaTabResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => metadataSchemaTabResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
