import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPeopleModalComponent } from './add-people-modal.component';

describe('AddPeopleModalComponent', () => {
  let component: AddPeopleModalComponent;
  let fixture: ComponentFixture<AddPeopleModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPeopleModalComponent]
    });
    fixture = TestBed.createComponent(AddPeopleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
