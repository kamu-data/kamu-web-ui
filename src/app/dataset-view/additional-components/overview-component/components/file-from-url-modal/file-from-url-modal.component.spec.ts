import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileFromUrlModalComponent } from './file-from-url-modal.component';

describe('FileFromUrlModalComponent', () => {
  let component: FileFromUrlModalComponent;
  let fixture: ComponentFixture<FileFromUrlModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileFromUrlModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileFromUrlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
