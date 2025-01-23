import { TestBed } from '@angular/core/testing';

import { AccountEmailService } from './account-email.service';

describe('AccountEmailService', () => {
  let service: AccountEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
