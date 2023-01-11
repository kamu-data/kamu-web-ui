import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnginePropertyComponent } from './engine-property.component';

describe('EnginePropertyComponent', () => {
  let component: EnginePropertyComponent;
  let fixture: ComponentFixture<EnginePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnginePropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnginePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
