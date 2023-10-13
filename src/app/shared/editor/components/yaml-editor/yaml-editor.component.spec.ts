import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YamlEditorComponent } from './yaml-editor.component';

describe('YamlEditorComponent', () => {
  let component: YamlEditorComponent;
  let fixture: ComponentFixture<YamlEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YamlEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YamlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
