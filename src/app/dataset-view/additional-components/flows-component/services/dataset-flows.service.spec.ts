import { TestBed } from '@angular/core/testing';

import { DatasetFlowsService } from './dataset-flows.service';

describe('DatasetFlowsService', () => {
  let service: DatasetFlowsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetFlowsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
