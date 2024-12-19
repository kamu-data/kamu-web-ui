import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetVisibilityComponent } from './dataset-visibility.component';

describe('DatasetVisibilityComponent', () => {
  let component: DatasetVisibilityComponent;
  let fixture: ComponentFixture<DatasetVisibilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetVisibilityComponent]
    });
    fixture = TestBed.createComponent(DatasetVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
