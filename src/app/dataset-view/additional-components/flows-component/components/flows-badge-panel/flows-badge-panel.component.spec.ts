import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowsBadgePanelComponent } from './flows-badge-panel.component';

describe('FlowsBadgePanelComponent', () => {
  let component: FlowsBadgePanelComponent;
  let fixture: ComponentFixture<FlowsBadgePanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FlowsBadgePanelComponent]
    });
    fixture = TestBed.createComponent(FlowsBadgePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
