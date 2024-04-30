import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFlowsTabComponent } from './account-flows-tab.component';

describe('AccountFlowsTabComponent', () => {
  let component: AccountFlowsTabComponent;
  let fixture: ComponentFixture<AccountFlowsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountFlowsTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountFlowsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
