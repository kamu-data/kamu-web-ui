import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetTransformEventComponent } from './set-transform-event.component';

describe('SetTransformEventComponent', () => {
  let component: SetTransformEventComponent;
  let fixture: ComponentFixture<SetTransformEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetTransformEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetTransformEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
