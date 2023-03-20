import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReadStepComponent } from "./read-step.component";

describe("ReadStepComponent", () => {
    let component: ReadStepComponent;
    let fixture: ComponentFixture<ReadStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReadStepComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ReadStepComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
