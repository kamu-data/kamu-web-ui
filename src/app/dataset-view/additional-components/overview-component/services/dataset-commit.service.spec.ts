import { TestBed } from '@angular/core/testing';

import { DatasetCommitService } from './dataset-commit.service';

describe('DatasetCommitService', () => {
  let service: DatasetCommitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetCommitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
