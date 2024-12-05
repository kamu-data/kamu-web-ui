import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAvailableButtonComponent } from './admin-available-button.component';

describe('AdminAvailableButtonComponent', () => {
  let component: AdminAvailableButtonComponent;
  let fixture: ComponentFixture<AdminAvailableButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAvailableButtonComponent]
    });
    fixture = TestBed.createComponent(AdminAvailableButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
