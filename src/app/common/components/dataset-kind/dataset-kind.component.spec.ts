import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetKindComponent } from './dataset-kind.component';

describe('DatasetKindComponent', () => {
  let component: DatasetKindComponent;
  let fixture: ComponentFixture<DatasetKindComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatasetKindComponent]
    });
    fixture = TestBed.createComponent(DatasetKindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
