import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { addWebhookResolver } from './add-webhook.resolver';

describe('addWebhookResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => addWebhookResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
