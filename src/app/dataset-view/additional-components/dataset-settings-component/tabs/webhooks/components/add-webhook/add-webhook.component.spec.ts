import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWebhookComponent } from './add-webhook.component';

describe('AddWebhookComponent', () => {
  let component: AddWebhookComponent;
  let fixture: ComponentFixture<AddWebhookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddWebhookComponent]
    });
    fixture = TestBed.createComponent(AddWebhookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
