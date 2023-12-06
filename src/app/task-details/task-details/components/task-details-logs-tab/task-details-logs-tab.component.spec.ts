import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsLogsTabComponent } from './task-details-logs-tab.component';

describe('TaskDetailsLogsTabComponent', () => {
  let component: TaskDetailsLogsTabComponent;
  let fixture: ComponentFixture<TaskDetailsLogsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDetailsLogsTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailsLogsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
