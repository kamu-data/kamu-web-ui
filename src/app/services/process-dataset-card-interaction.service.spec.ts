import { TestBed } from '@angular/core/testing';

import { ProcessDatasetCardInteractionService } from './process-dataset-card-interaction.service';

describe('ProcessDatasetCardInteractionService', () => {
  let service: ProcessDatasetCardInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessDatasetCardInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
