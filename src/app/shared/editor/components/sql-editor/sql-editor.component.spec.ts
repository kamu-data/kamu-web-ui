import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlEditorComponent } from './sql-editor.component';

describe('SqlEditorComponent', () => {
  let component: SqlEditorComponent;
  let fixture: ComponentFixture<SqlEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SqlEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
