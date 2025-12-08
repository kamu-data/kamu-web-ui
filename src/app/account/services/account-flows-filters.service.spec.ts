import { TestBed } from '@angular/core/testing';

import { AccountFlowsFiltersService } from './account-flows-filters.service';

describe('AccountFlowsFiltersService', () => {
  let service: AccountFlowsFiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountFlowsFiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
