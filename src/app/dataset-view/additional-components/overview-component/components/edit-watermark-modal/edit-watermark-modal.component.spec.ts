import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWatermarkModalComponent } from './edit-watermark-modal.component';

describe('EditWatermarkModalComponent', () => {
  let component: EditWatermarkModalComponent;
  let fixture: ComponentFixture<EditWatermarkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWatermarkModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWatermarkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
