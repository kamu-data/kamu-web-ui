import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteQueryEventComponent } from './execute-query-event.component';

describe('ExecuteQueryEventComponent', () => {
  let component: ExecuteQueryEventComponent;
  let fixture: ComponentFixture<ExecuteQueryEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecuteQueryEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecuteQueryEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
