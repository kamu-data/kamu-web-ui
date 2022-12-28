import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPollingSourceEventComponent } from './set-polling-source-event.component';

describe('SetPollingSourceEventComponent', () => {
  let component: SetPollingSourceEventComponent;
  let fixture: ComponentFixture<SetPollingSourceEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetPollingSourceEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetPollingSourceEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
