import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditKeyValueModalComponent } from './edit-key-value-modal.component';

describe('EditKeyValueModalComponent', () => {
  let component: EditKeyValueModalComponent;
  let fixture: ComponentFixture<EditKeyValueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditKeyValueModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditKeyValueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
