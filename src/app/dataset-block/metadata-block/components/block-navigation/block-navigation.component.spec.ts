import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockNavigationComponent } from './block-navigation.component';

describe('BlockNavigationComponent', () => {
  let component: BlockNavigationComponent;
  let fixture: ComponentFixture<BlockNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
