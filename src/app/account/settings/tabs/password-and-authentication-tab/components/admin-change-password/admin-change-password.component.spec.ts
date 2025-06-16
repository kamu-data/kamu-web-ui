import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChangePasswordComponent } from './admin-change-password.component';

describe('AdminChangePasswordComponent', () => {
  let component: AdminChangePasswordComponent;
  let fixture: ComponentFixture<AdminChangePasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminChangePasswordComponent]
    });
    fixture = TestBed.createComponent(AdminChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
