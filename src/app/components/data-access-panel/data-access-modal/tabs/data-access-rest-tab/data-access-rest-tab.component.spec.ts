import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAccessRestTabComponent } from './data-access-rest-tab.component';

describe('DataAccessRestTabComponent', () => {
  let component: DataAccessRestTabComponent;
  let fixture: ComponentFixture<DataAccessRestTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataAccessRestTabComponent]
    });
    fixture = TestBed.createComponent(DataAccessRestTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
