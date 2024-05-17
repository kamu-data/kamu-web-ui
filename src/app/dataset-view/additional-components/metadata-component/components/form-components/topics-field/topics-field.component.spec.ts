import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsFieldComponent } from './topics-field.component';

describe('TopicsFieldComponent', () => {
  let component: TopicsFieldComponent;
  let fixture: ComponentFixture<TopicsFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicsFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
