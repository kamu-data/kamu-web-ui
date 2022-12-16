import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockRowDataComponent } from './block-row-data.component';

describe('BlockRowDataComponent', () => {
  let component: BlockRowDataComponent;
  let fixture: ComponentFixture<BlockRowDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockRowDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockRowDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
