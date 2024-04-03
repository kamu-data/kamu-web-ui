import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceessTokensTabComponent } from './aceess-tokens-tab.component';

describe('AceessTokensTabComponent', () => {
  let component: AceessTokensTabComponent;
  let fixture: ComponentFixture<AceessTokensTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceessTokensTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceessTokensTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
