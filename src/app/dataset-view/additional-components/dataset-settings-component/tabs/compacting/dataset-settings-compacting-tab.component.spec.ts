import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetSettingsCompactingTabComponent } from './dataset-settings-compacting-tab.component';

describe('DatasetSettingsCompactingTabComponent', () => {
  let component: DatasetSettingsCompactingTabComponent;
  let fixture: ComponentFixture<DatasetSettingsCompactingTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetSettingsCompactingTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetSettingsCompactingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
