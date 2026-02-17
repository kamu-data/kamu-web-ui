/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { findElementByDataTestId, registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { CommitmentDataSectionComponent } from "src/app/query-explainer/components/commitment-data-section/commitment-data-section.component";
import {
    mockQueryExplainerResponse,
    mockVerifyQueryResponseSuccess,
} from "src/app/query-explainer/query-explainer.mocks";

describe("CommitmentDataSectionComponent", () => {
    let component: CommitmentDataSectionComponent;
    let fixture: ComponentFixture<CommitmentDataSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommitmentDataSectionComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
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
