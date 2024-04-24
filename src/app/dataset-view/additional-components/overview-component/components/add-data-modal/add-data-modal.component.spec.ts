import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDataModalComponent } from './add-data-modal.component';

describe('AddDataModalComponent', () => {
  let component: AddDataModalComponent;
  let fixture: ComponentFixture<AddDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDataModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
