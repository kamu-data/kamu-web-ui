import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataPollingSourceTabComponent } from './metadata-polling-source-tab.component';

describe('MetadataPollingSourceTabComponent', () => {
  let component: MetadataPollingSourceTabComponent;
  let fixture: ComponentFixture<MetadataPollingSourceTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataPollingSourceTabComponent]
    });
    fixture = TestBed.createComponent(MetadataPollingSourceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
