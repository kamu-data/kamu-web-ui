import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAccessStreamTabComponent } from './data-access-stream-tab.component';

describe('DataAccessStreamTabComponent', () => {
  let component: DataAccessStreamTabComponent;
  let fixture: ComponentFixture<DataAccessStreamTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataAccessStreamTabComponent]
    });
    fixture = TestBed.createComponent(DataAccessStreamTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
