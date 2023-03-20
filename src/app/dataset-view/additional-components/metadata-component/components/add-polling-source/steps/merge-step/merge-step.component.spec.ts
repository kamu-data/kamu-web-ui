import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MergeStepComponent } from "./merge-step.component";

describe("MergeStepComponent", () => {
    let component: MergeStepComponent;
    let fixture: ComponentFixture<MergeStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MergeStepComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MergeStepComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
