import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashPropertyComponent } from './hash-property.component';

describe('HashPropertyComponent', () => {
  let component: HashPropertyComponent;
  let fixture: ComponentFixture<HashPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashPropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HashPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
