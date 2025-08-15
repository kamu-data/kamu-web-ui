import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataTransformationTabComponent } from './metadata-transformation-tab.component';

describe('MetadataTransformationTabComponent', () => {
  let component: MetadataTransformationTabComponent;
  let fixture: ComponentFixture<MetadataTransformationTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataTransformationTabComponent]
    });
    fixture = TestBed.createComponent(MetadataTransformationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
