import { TestBed } from '@angular/core/testing';

import { EvnironmentVariablesService } from './evnironment-variables.service';

describe('EvnironmentVariablesService', () => {
  let service: EvnironmentVariablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvnironmentVariablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
