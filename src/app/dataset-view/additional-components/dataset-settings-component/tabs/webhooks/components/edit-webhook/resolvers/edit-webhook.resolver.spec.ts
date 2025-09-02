import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { editWebhookResolver } from './edit-webhook.resolver';

describe('editWebhookResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => editWebhookResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
