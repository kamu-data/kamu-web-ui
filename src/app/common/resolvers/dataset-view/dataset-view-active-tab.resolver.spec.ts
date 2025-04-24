import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { datasetViewActiveTabResolver } from './dataset-view-active-tab.resolver';

describe('datasetViewActiveTabResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => datasetViewActiveTabResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
