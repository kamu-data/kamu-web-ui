import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetFlowDetailsComponent } from './dataset-flow-details.component';

describe('DatasetFlowDetailsComponent', () => {
  let component: DatasetFlowDetailsComponent;
  let fixture: ComponentFixture<DatasetFlowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetFlowDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetFlowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
