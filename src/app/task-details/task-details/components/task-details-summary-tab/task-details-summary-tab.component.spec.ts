import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsSummaryTabComponent } from './task-details-summary-tab.component';

describe('TaskDetailsSummaryTabComponent', () => {
  let component: TaskDetailsSummaryTabComponent;
  let fixture: ComponentFixture<TaskDetailsSummaryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDetailsSummaryTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailsSummaryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
