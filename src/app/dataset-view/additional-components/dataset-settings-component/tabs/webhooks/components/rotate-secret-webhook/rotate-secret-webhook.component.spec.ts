import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotateSecretWebhookComponent } from './rotate-secret-webhook.component';

describe('RotateSecretWebhookComponent', () => {
  let component: RotateSecretWebhookComponent;
  let fixture: ComponentFixture<RotateSecretWebhookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RotateSecretWebhookComponent]
    });
    fixture = TestBed.createComponent(RotateSecretWebhookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
