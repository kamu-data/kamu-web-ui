import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IntervalPropertyComponent } from "./interval-property.component";

describe("IntervalPropertyComponent", () => {
    let component: IntervalPropertyComponent;
    let fixture: ComponentFixture<IntervalPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IntervalPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(IntervalPropertyComponent);
        component = fixture.componentInstance;
        (component.data = {
            __typename: "OffsetInterval",
            start: 0,
            end: 596125,
        }),
            fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
