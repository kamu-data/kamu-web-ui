import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPropertyComponent } from './link-property.component';

describe('LinkPropertyComponent', () => {
  let component: LinkPropertyComponent;
  let fixture: ComponentFixture<LinkPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkPropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
