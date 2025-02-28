/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommitmentDataSectionComponent } from "./commitment-data-section.component";
import { mockQueryExplainerResponse, mockVerifyQueryResponseSuccess } from "../../query-explainer.mocks";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { findElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { MatIconModule } from "@angular/material/icon";

describe("CommitmentDataSectionComponent", () => {
    let component: CommitmentDataSectionComponent;
    let fixture: ComponentFixture<CommitmentDataSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CommitmentDataSectionComponent],
            imports: [MatIconModule, HttpClientTestingModule],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(CommitmentDataSectionComponent);
        component = fixture.componentInstance;
        component.commitmentData = {
            sqlQueryExplainerResponse: mockQueryExplainerResponse,
            sqlQueryVerify: mockVerifyQueryResponseSuccess,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check display commitment data", () => {
        fixture.detectChanges();
        const inputHashElem = findElementByDataTestId(fixture, "input-hash");
        expect(inputHashElem?.innerText.trim()).toEqual(mockQueryExplainerResponse.commitment.inputHash);

        const outputHashElem = findElementByDataTestId(fixture, "output-hash");
        expect(outputHashElem?.innerText.trim()).toEqual(mockQueryExplainerResponse.commitment.outputHash);

        const subQueriesHashElem = findElementByDataTestId(fixture, "sub-queries-hash");
        expect(subQueriesHashElem?.innerText.trim()).toEqual(mockQueryExplainerResponse.commitment.subQueriesHash);
    });
});
