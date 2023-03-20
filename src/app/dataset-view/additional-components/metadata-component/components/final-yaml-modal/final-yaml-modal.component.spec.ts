import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FinalYamlModalComponent } from "./final-yaml-modal.component";

describe("MonacoEditorModalComponent", () => {
    let component: FinalYamlModalComponent;
    let fixture: ComponentFixture<FinalYamlModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FinalYamlModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FinalYamlModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
