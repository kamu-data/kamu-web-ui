import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproducedResultSectionComponent } from './reproduced-result-section.component';

describe('ReproducedResultSectionComponent', () => {
  let component: ReproducedResultSectionComponent;
  let fixture: ComponentFixture<ReproducedResultSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReproducedResultSectionComponent]
    });
    fixture = TestBed.createComponent(ReproducedResultSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
