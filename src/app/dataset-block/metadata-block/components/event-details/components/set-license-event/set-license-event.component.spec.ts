import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetLicenseEventComponent } from './set-license-event.component';

describe('SetLicenseEventComponent', () => {
  let component: SetLicenseEventComponent;
  let fixture: ComponentFixture<SetLicenseEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetLicenseEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetLicenseEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
