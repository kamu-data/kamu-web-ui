/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { findElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
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
        fixture.componentRef.setInput("class", testClass);
        fixture.componentRef.setInput("sqlLoading", true);
        fixture.detectChanges();
        tick(1000);
        fixture.componentRef.setInput("sqlLoading", false);
        fixture.detectChanges();
        const timeElement = findElementByDataTestId(fixture, "duration-request-time");
        expect(timeElement?.textContent?.trim()).toEqual(resultTime);
        expect(timeElement?.classList).toContain(testClass);
        flush();
    }));

    it("should show a reset time when the tab is hidden during a request", fakeAsync(() => {
        fixture.componentRef.setInput("class", "mock-class");
        fixture.componentRef.setInput("sqlLoading", true);
        fixture.detectChanges();
        tick(1000);
        const timeElement = findElementByDataTestId(fixture, "duration-request-time");
        expect(timeElement?.textContent?.trim()).toEqual("00:00:01.00");

        spyOnProperty(document, "visibilityState").and.returnValue("hidden");
        document.dispatchEvent(new Event("visibilitychange"));
        fixture.detectChanges();

        expect(timeElement?.textContent?.trim()).toEqual("00:00:00.00");
        flush();
    }));
});
