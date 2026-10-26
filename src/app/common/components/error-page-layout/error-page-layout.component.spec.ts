/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ErrorPageLayoutComponent } from "@common/components/error-page-layout/error-page-layout.component";
import { getElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";

@Component({
    template: `<app-error-page-layout title="Page unavailable">
        <p data-test-id="projected-message">Something went wrong</p>
        <button errorPageActions data-test-id="projected-action">Retry</button>
    </app-error-page-layout>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ErrorPageLayoutComponent],
})
class TestHostComponent {}

describe("ErrorPageLayoutComponent", () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent],
        });
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it("should show the application logo above the projected content", () => {
        expect(getElementByDataTestId(fixture, "error-page-logo").getAttribute("src")).toEqual(
            `/${AppValues.APP_LOGO}`,
        );
        expect(getElementByDataTestId(fixture, "projected-message").textContent?.trim()).toEqual(
            "Something went wrong",
        );
    });

    it("should render the title", () => {
        expect(getElementByDataTestId(fixture, "error-page-title").textContent?.trim()).toEqual("Page unavailable");
    });

    it("should keep the actions out of the text block", () => {
        const description = getElementByDataTestId(fixture, "error-page-description");
        expect(description.contains(getElementByDataTestId(fixture, "projected-message"))).toBe(true);
        expect(description.contains(getElementByDataTestId(fixture, "projected-action"))).toBe(false);
    });
});
