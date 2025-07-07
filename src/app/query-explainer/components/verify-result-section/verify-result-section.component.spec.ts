/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VerifyResultSectionComponent } from "./verify-result-section.component";
import { mockVerifyQueryOutputMismatchError, mockVerifyQueryResponseSuccess } from "../../query-explainer.mocks";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";

describe("VerifyResultSectionComponent", () => {
    let component: VerifyResultSectionComponent;
    let fixture: ComponentFixture<VerifyResultSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [VerifyResultSectionComponent],
        });
        fixture = TestBed.createComponent(VerifyResultSectionComponent);
        component = fixture.componentInstance;
        component.verifyResponse = mockVerifyQueryResponseSuccess;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check verify result is successfull", () => {
        component.verifyResponse = mockVerifyQueryResponseSuccess;
        fixture.detectChanges();
        const resultElem = findElementByDataTestId(fixture, "verification-success");
        expect(resultElem?.innerText.trim()).toEqual("Verification successful");
    });

    it("should check verify result is failed", () => {
        component.verifyResponse = mockVerifyQueryOutputMismatchError;
        fixture.detectChanges();
        const resultElem = findElementByDataTestId(fixture, "verification-failed");
        expect(resultElem?.innerText.trim()).toEqual("Verification failed");

        const actualHashElem = findElementByDataTestId(fixture, "error-actual-hash");
        expect(actualHashElem?.innerText.trim()).toEqual(
            "Actual hash: f16207781e20aca696acfafc462429613e7d5c3d0f333d6bd0003240b53a083a52d29",
        );
        const expectedHashElem = findElementByDataTestId(fixture, "error-expected-hash");
        expect(expectedHashElem?.innerText.trim()).toEqual(
            "Expected hash: f16207781e20aca696acfafc462429613e7d5c3d0f333d6bd0003240b53a083a52d27",
        );
    });
});
