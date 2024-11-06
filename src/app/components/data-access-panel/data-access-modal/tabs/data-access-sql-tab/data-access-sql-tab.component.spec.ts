import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAccessSqlTabComponent } from './data-access-sql-tab.component';

describe('DataAccessSqlTabComponent', () => {
  let component: DataAccessSqlTabComponent;
  let fixture: ComponentFixture<DataAccessSqlTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataAccessSqlTabComponent]
    });
    fixture = TestBed.createComponent(DataAccessSqlTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
