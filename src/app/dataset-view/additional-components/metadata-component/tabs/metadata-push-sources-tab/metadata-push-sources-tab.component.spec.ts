import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataPushSourcesTabComponent } from './metadata-push-sources-tab.component';

describe('MetadataPushSourcesTabComponent', () => {
  let component: MetadataPushSourcesTabComponent;
  let fixture: ComponentFixture<MetadataPushSourcesTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataPushSourcesTabComponent]
    });
    fixture = TestBed.createComponent(MetadataPushSourcesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
