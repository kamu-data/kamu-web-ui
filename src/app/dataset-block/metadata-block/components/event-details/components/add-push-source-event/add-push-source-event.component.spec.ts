import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPushSourceEventComponent } from './add-push-source-event.component';

describe('AddPushSourceEventComponent', () => {
  let component: AddPushSourceEventComponent;
  let fixture: ComponentFixture<AddPushSourceEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPushSourceEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPushSourceEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
