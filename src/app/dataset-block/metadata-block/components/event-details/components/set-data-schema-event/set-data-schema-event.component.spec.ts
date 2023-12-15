import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDataSchemaEventComponent } from './set-data-schema-event.component';

describe('SetDataSchemaEventComponent', () => {
  let component: SetDataSchemaEventComponent;
  let fixture: ComponentFixture<SetDataSchemaEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetDataSchemaEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetDataSchemaEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
