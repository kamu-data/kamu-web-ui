import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditWebhookFormComponent } from './create-edit-webhook-form.component';

describe('CreateEditWebhookFormComponent', () => {
  let component: CreateEditWebhookFormComponent;
  let fixture: ComponentFixture<CreateEditWebhookFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateEditWebhookFormComponent]
    });
    fixture = TestBed.createComponent(CreateEditWebhookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
