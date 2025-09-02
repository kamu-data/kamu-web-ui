import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWebhooksComponent } from './list-webhooks.component';

describe('ListWebhooksComponent', () => {
  let component: ListWebhooksComponent;
  let fixture: ComponentFixture<ListWebhooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListWebhooksComponent]
    });
    fixture = TestBed.createComponent(ListWebhooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
