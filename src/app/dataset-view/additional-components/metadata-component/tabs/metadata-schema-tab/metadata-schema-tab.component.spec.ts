import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataSchemaTabComponent } from './metadata-schema-tab.component';

describe('MetadataSchemaTabComponent', () => {
  let component: MetadataSchemaTabComponent;
  let fixture: ComponentFixture<MetadataSchemaTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataSchemaTabComponent]
    });
    fixture = TestBed.createComponent(MetadataSchemaTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
