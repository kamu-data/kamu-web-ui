/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { RequestTimerComponent } from "./request-timer.component";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";

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

    it("should check rennder result time", fakeAsync(() => {
        const testClass = "mock-class";
        const timeElement = findElementByDataTestId(fixture, "duration-request-time");
        component.class = testClass;
        const resultTime = "00:00:01.00";
        component.ngOnChanges({
            sqlLoading: {
                previousValue: undefined,
                currentValue: true,
                firstChange: true,
                isFirstChange: () => true,
            },
        });
        tick(1000);
        component.ngOnChanges({
            sqlLoading: {
                previousValue: true,
                currentValue: false,
                firstChange: false,
                isFirstChange: () => false,
            },
        });
        fixture.detectChanges();
        expect(timeElement?.textContent?.trim()).toEqual(resultTime);
        expect(timeElement?.classList).toContain(testClass);
        flush();
    }));
});
