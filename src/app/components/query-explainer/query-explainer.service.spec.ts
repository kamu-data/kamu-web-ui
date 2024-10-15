import { TestBed } from '@angular/core/testing';

import { QueryExplainerService } from './query-explainer.service';

describe('QueryExplainerService', () => {
  let service: QueryExplainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryExplainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
