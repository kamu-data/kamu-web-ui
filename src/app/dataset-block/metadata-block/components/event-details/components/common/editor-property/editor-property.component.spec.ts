import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditorPropertyComponent } from "./editor-property.component";

describe("EditorPropertyComponent", () => {
    let component: EditorPropertyComponent;
    let fixture: ComponentFixture<EditorPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditorPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditorPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
