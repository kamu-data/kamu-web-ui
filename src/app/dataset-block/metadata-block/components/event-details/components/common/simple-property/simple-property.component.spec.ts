import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplePropertyComponent } from './simple-property.component';

describe('SimplePropertyComponent', () => {
  let component: SimplePropertyComponent;
  let fixture: ComponentFixture<SimplePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimplePropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimplePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
