import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsPropertyComponent } from './topics-property.component';

describe('TopicsPropertyComponent', () => {
  let component: TopicsPropertyComponent;
  let fixture: ComponentFixture<TopicsPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicsPropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
