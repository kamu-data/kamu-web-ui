import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowDetailsHistoryTabComponent } from './flow-details-history-tab.component';

describe('FlowDetailsHistoryTabComponent', () => {
  let component: FlowDetailsHistoryTabComponent;
  let fixture: ComponentFixture<FlowDetailsHistoryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowDetailsHistoryTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowDetailsHistoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
