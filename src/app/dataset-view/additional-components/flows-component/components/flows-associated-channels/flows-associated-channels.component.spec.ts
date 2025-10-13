import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowsAssociatedChannelsComponent } from './flows-associated-channels.component';

describe('FlowsAssociatedChannelsComponent', () => {
  let component: FlowsAssociatedChannelsComponent;
  let fixture: ComponentFixture<FlowsAssociatedChannelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FlowsAssociatedChannelsComponent]
    });
    fixture = TestBed.createComponent(FlowsAssociatedChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
