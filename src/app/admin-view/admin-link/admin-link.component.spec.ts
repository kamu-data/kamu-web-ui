import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLinkComponent } from './admin-link.component';

describe('AdminLinkComponent', () => {
  let component: AdminLinkComponent;
  let fixture: ComponentFixture<AdminLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminLinkComponent]
    });
    fixture = TestBed.createComponent(AdminLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
