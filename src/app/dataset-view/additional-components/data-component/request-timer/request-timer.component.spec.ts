import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RequestTimerComponent } from "./request-timer.component";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";

describe("RequestTimerComponent", () => {
    let component: RequestTimerComponent;
    let fixture: ComponentFixture<RequestTimerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RequestTimerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RequestTimerComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check show duration time when milliseconds < 0", () => {
        component.resultTime = 0;
        component.class = "text-bg-success";
        fixture.detectChanges();
        const durationTimeElement = findElementByDataTestId(fixture, "duration-time");
        expect(durationTimeElement?.textContent?.trim()).toEqual("00:00:00.000");
        expect(durationTimeElement?.classList).toContain("text-bg-success");
    });

    it("should check show duration time when milliseconds > 0", () => {
        component.resultTime = 1000;
        component.class = "text-bg-success";
        fixture.detectChanges();
        const durationTimeElement = findElementByDataTestId(fixture, "duration-time");
        expect(durationTimeElement?.textContent?.trim()).toEqual("00:00:01.00");
        expect(durationTimeElement?.classList).toContain("text-bg-success");
    });
});
