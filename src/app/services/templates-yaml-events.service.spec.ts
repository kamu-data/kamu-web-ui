import { TestBed } from '@angular/core/testing';

import { TemplatesYamlEventsService } from './templates-yaml-events.service';

describe('TemplatesYamlEventsService', () => {
  let service: TemplatesYamlEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplatesYamlEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
