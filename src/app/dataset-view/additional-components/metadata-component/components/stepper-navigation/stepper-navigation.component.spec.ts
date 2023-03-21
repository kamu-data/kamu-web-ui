import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StepperNavigationComponent } from "./stepper-navigation.component";

describe("StepperNavigationComponent", () => {
    let component: StepperNavigationComponent;
    let fixture: ComponentFixture<StepperNavigationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StepperNavigationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StepperNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
