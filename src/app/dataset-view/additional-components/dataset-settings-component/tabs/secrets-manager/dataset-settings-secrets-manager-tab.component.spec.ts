import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetSettingsSecretsManagerTabComponent } from './dataset-settings-secrets-manager-tab.component';

describe('DatasetSettingsSecretsManagerTabComponent', () => {
  let component: DatasetSettingsSecretsManagerTabComponent;
  let fixture: ComponentFixture<DatasetSettingsSecretsManagerTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetSettingsSecretsManagerTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetSettingsSecretsManagerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
