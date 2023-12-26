import { TestBed } from '@angular/core/testing';

import { EditAddPushSourceService } from './edit-add-push-source.service';

describe('EditAddPushSourceService', () => {
  let service: EditAddPushSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditAddPushSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
