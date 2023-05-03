import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PreprocessStepComponent } from "./preprocess-step.component";

describe("PreprocessStepComponent", () => {
    let component: PreprocessStepComponent;
    let fixture: ComponentFixture<PreprocessStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PreprocessStepComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PreprocessStepComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
