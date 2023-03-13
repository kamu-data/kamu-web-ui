import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPollingSourceComponent } from './add-polling-source.component';

describe('AddPollingSourceComponent', () => {
  let component: AddPollingSourceComponent;
  let fixture: ComponentFixture<AddPollingSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPollingSourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPollingSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
