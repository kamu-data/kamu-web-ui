import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataWatermarkTabComponent } from './metadata-watermark-tab.component';

describe('MetadataWatermarkTabComponent', () => {
  let component: MetadataWatermarkTabComponent;
  let fixture: ComponentFixture<MetadataWatermarkTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataWatermarkTabComponent]
    });
    fixture = TestBed.createComponent(MetadataWatermarkTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
