import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAccessKamuCliTabComponent } from './data-access-kamu-cli-tab.component';

describe('DataAccessKamuCliTabComponent', () => {
  let component: DataAccessKamuCliTabComponent;
  let fixture: ComponentFixture<DataAccessKamuCliTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataAccessKamuCliTabComponent]
    });
    fixture = TestBed.createComponent(DataAccessKamuCliTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
