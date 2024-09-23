import { TestBed } from '@angular/core/testing';

import { ElementsViewService } from './elements-view.service';

describe('ElementsViewService', () => {
  let service: ElementsViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementsViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
