import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWebhookComponent } from './edit-webhook.component';

describe('EditWebhookComponent', () => {
  let component: EditWebhookComponent;
  let fixture: ComponentFixture<EditWebhookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditWebhookComponent]
    });
    fixture = TestBed.createComponent(EditWebhookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
