import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryExplainerComponent } from './query-explainer.component';

describe('QueryExplainerComponent', () => {
  let component: QueryExplainerComponent;
  let fixture: ComponentFixture<QueryExplainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueryExplainerComponent]
    });
    fixture = TestBed.createComponent(QueryExplainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
