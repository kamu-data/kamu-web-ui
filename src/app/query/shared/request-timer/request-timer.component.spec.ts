/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { findElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { RequestTimerComponent } from "src/app/query/shared/request-timer/request-timer.component";

describe("RequestTimerComponent", () => {
    let component: RequestTimerComponent;
    let fixture: ComponentFixture<RequestTimerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, RequestTimerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RequestTimerComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check rennder result time", fakeAsync(() => {
        const testClass = "mock-class";
        const resultTime = "00:00:01.00";
        setComponentInput(fixture, "class", testClass);
        setComponentInput(fixture, "sqlLoading", true);
        fixture.detectChanges();
        tick(1000);
        setComponentInput(fixture, "sqlLoading", false);
        fixture.detectChanges();
        const timeElement = findElementByDataTestId(fixture, "duration-request-time");
        expect(timeElement?.textContent?.trim()).toEqual(resultTime);
        expect(timeElement?.classList).toContain(testClass);
        flush();
    }));

    it("should keep the timer running when only the class changes", fakeAsync(() => {
        setComponentInput(fixture, "class", "mock-class");
        setComponentInput(fixture, "sqlLoading", true);
        fixture.detectChanges();
        tick(1000);
        setComponentInput(fixture, "class", "another-class");
        fixture.detectChanges();
        tick(1000);
        setComponentInput(fixture, "sqlLoading", false);
        fixture.detectChanges();
        const timeElement = findElementByDataTestId(fixture, "duration-request-time");
        expect(timeElement?.textContent?.trim()).toEqual("00:00:02.00");
        flush();
    }));

    it("should show a reset time when the tab is hidden during a request", fakeAsync(() => {
        setComponentInput(fixture, "class", "mock-class");
        setComponentInput(fixture, "sqlLoading", true);
        fixture.detectChanges();
        tick(1000);
        const timeElement = findElementByDataTestId(fixture, "duration-request-time");
        expect(timeElement?.textContent?.trim()).toEqual("00:00:01.00");

        vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
        document.dispatchEvent(new Event("visibilitychange"));
        fixture.detectChanges();

        expect(timeElement?.textContent?.trim()).toEqual("00:00:00.00");
        flush();
    }));
});
