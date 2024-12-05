import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetViewMenuItemComponent } from './dataset-view-menu-item.component';

describe('DatasetViewMenuItemComponent', () => {
  let component: DatasetViewMenuItemComponent;
  let fixture: ComponentFixture<DatasetViewMenuItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetViewMenuItemComponent]
    });
    fixture = TestBed.createComponent(DatasetViewMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
