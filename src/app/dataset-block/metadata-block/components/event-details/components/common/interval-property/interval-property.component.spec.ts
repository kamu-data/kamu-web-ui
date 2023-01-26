import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalPropertyComponent } from './interval-property.component';

describe('IntervalPropertyComponent', () => {
  let component: IntervalPropertyComponent;
  let fixture: ComponentFixture<IntervalPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervalPropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervalPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
