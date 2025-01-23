import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsTabComponent } from './emails-tab.component';

describe('EmailsTabComponent', () => {
  let component: EmailsTabComponent;
  let fixture: ComponentFixture<EmailsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailsTabComponent]
    });
    fixture = TestBed.createComponent(EmailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
