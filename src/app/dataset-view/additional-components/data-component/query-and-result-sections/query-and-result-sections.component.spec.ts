import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryAndResultSectionsComponent } from './query-and-result-sections.component';

describe('QueryAndResultSectionsComponent', () => {
  let component: QueryAndResultSectionsComponent;
  let fixture: ComponentFixture<QueryAndResultSectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueryAndResultSectionsComponent]
    });
    fixture = TestBed.createComponent(QueryAndResultSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
