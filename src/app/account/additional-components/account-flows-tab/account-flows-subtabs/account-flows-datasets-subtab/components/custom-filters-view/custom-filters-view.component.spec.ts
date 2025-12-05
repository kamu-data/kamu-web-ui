import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFiltersViewComponent } from './custom-filters-view.component';

describe('CustomFiltersViewComponent', () => {
  let component: CustomFiltersViewComponent;
  let fixture: ComponentFixture<CustomFiltersViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomFiltersViewComponent]
    });
    fixture = TestBed.createComponent(CustomFiltersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
