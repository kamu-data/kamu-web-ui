import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileBaseWidgetComponent } from './tile-base-widget.component';

describe('TileBaseWidgetComponent', () => {
  let component: TileBaseWidgetComponent;
  let fixture: ComponentFixture<TileBaseWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TileBaseWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileBaseWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
