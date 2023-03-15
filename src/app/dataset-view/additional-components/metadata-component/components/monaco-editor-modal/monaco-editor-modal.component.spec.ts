import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MonacoEditorModalComponent } from "./monaco-editor-modal.component";

describe("MonacoEditorModalComponent", () => {
    let component: MonacoEditorModalComponent;
    let fixture: ComponentFixture<MonacoEditorModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MonacoEditorModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MonacoEditorModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
