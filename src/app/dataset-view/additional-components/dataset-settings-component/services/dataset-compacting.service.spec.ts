import { TestBed } from '@angular/core/testing';

import { DatasetCompactingService } from './dataset-compacting.service';

describe('DatasetCompactingService', () => {
  let service: DatasetCompactingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetCompactingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
