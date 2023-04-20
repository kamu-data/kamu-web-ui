import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadFieldComponent } from './typeahead-field.component';

describe('TypeaheadFieldComponent', () => {
  let component: TypeaheadFieldComponent;
  let fixture: ComponentFixture<TypeaheadFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeaheadFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeaheadFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
