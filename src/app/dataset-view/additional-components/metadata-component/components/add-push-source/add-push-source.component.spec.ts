import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPushSourceComponent } from './add-push-source.component';

describe('AddPushSourceComponent', () => {
  let component: AddPushSourceComponent;
  let fixture: ComponentFixture<AddPushSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPushSourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPushSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
