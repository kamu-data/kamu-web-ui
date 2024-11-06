import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAccessOdataTabComponent } from './data-access-odata-tab.component';

describe('DataAccessOdataTabComponent', () => {
  let component: DataAccessOdataTabComponent;
  let fixture: ComponentFixture<DataAccessOdataTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataAccessOdataTabComponent]
    });
    fixture = TestBed.createComponent(DataAccessOdataTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
