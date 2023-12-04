import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsHistoryTabComponent } from './task-details-history-tab.component';

describe('TaskDetailsHistoryTabComponent', () => {
  let component: TaskDetailsHistoryTabComponent;
  let fixture: ComponentFixture<TaskDetailsHistoryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDetailsHistoryTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailsHistoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
