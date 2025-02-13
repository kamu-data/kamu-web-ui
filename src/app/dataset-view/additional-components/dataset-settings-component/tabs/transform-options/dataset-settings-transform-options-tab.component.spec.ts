import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetSettingsTransformOptionsTabComponent } from './dataset-settings-transform-options-tab.component';

describe('DatasetSettingsTransformOptionsTabComponent', () => {
  let component: DatasetSettingsTransformOptionsTabComponent;
  let fixture: ComponentFixture<DatasetSettingsTransformOptionsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetSettingsTransformOptionsTabComponent]
    });
    fixture = TestBed.createComponent(DatasetSettingsTransformOptionsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
