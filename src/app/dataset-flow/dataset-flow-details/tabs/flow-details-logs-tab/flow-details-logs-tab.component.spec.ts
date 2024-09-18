import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowDetailsLogsTabComponent } from './flow-details-logs-tab.component';

describe('FlowDetailsLogsTabComponent', () => {
  let component: FlowDetailsLogsTabComponent;
  let fixture: ComponentFixture<FlowDetailsLogsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlowDetailsLogsTabComponent]
    });
    fixture = TestBed.createComponent(FlowDetailsLogsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
