import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OffsetIntervalPropertyComponent } from "./offset-interval-property.component";

describe("OffsetIntervalPropertyComponent", () => {
    let component: OffsetIntervalPropertyComponent;
    let fixture: ComponentFixture<OffsetIntervalPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OffsetIntervalPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OffsetIntervalPropertyComponent);
        component = fixture.componentInstance;
        (component.data = {
            block: { __typename: "OffsetInterval", start: 0, end: 596125 },
            datasetId: "csadsdsdsd",
        }),
            fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
