import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksTableComponent } from './tasks-table.component';

describe('TasksTableComponent', () => {
  let component: TasksTableComponent;
  let fixture: ComponentFixture<TasksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
