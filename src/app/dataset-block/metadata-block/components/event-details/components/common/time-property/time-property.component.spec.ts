import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TimePropertyComponent } from "./time-property.component";

describe("TimePropertyComponent", () => {
    let component: TimePropertyComponent;
    let fixture: ComponentFixture<TimePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimePropertyComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(TimePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
