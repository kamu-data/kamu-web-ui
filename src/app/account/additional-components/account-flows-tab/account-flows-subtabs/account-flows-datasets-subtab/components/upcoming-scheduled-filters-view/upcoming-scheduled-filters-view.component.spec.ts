import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingScheduledFiltersViewComponent } from './upcoming-scheduled-filters-view.component';

describe('UpcomingScheduledFiltersViewComponent', () => {
  let component: UpcomingScheduledFiltersViewComponent;
  let fixture: ComponentFixture<UpcomingScheduledFiltersViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UpcomingScheduledFiltersViewComponent]
    });
    fixture = TestBed.createComponent(UpcomingScheduledFiltersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
