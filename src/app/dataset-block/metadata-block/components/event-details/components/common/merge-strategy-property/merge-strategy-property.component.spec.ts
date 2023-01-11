import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeStrategyPropertyComponent } from './merge-strategy-property.component';

describe('MergeStrategyPropertyComponent', () => {
  let component: MergeStrategyPropertyComponent;
  let fixture: ComponentFixture<MergeStrategyPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeStrategyPropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeStrategyPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
