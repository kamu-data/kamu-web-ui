import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { allowAnonymousGuard } from './allow-anonymous.guard';

describe('allowAnonymousGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => allowAnonymousGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
