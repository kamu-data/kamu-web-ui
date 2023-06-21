import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetTransformComponent } from './set-transform.component';

describe('SetTransformComponent', () => {
  let component: SetTransformComponent;
  let fixture: ComponentFixture<SetTransformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetTransformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetTransformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
