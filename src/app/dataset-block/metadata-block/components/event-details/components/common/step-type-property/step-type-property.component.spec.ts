import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StepTypePropertyComponent } from "./step-type-property.component";

describe("ReadTypePropertyComponent", () => {
    let component: StepTypePropertyComponent;
    let fixture: ComponentFixture<StepTypePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StepTypePropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StepTypePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
