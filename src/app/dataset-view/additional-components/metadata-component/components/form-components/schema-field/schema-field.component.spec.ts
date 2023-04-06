import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaFieldComponent } from './schema-field.component';

describe('SchemaFieldComponent', () => {
  let component: SchemaFieldComponent;
  let fixture: ComponentFixture<SchemaFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemaFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemaFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
