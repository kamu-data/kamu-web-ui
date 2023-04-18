import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheFieldComponent } from './cache-field.component';

describe('CacheFieldComponent', () => {
  let component: CacheFieldComponent;
  let fixture: ComponentFixture<CacheFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CacheFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CacheFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
