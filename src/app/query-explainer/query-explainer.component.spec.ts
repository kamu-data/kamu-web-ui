/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ignoreElements, of, timer } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";
import type { Mock } from "vitest";

import { HIGHLIGHT_OPTIONS_PROVIDER } from "@common/helpers/app.helpers";
import {
    checkButtonDisabled,
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
    setFieldValue,
    stubMethod,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockDatasetByIdQuery } from "@api/mock/dataset.mock";

import { DatasetService } from "src/app/dataset-view/dataset.service";
import { QueryExplainerComponent } from "src/app/query-explainer/query-explainer.component";
import {
    mockQueryExplainerOutput,
    mockQueryExplainerResponse,
    mockTextareaCommitment,
    mockVerifyQueryResponseSuccess,
} from "src/app/query-explainer/query-explainer.mocks";
import { QueryExplainerService } from "src/app/query-explainer/query-explainer.service";

describe("QueryExplainerComponent", () => {
    let component: QueryExplainerComponent;
    let fixture: ComponentFixture<QueryExplainerComponent>;
    let queryExplainerService: QueryExplainerService;
    let datasetService: DatasetService;
    let toastrService: ToastrService;
    let verifyQuerySpy: Mock;
    let fetchCommitmentDataByUploadTokenSpy: Mock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedTestModule, QueryExplainerComponent],
            providers: [
                Apollo,
                provideToastr(),
                HIGHLIGHT_OPTIONS_PROVIDER,
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });

        registerMatSvgIcons();

        datasetService = TestBed.inject(DatasetService);
        toastrService = TestBed.inject(ToastrService);
        queryExplainerService = TestBed.inject(QueryExplainerService);
        verifyQuerySpy = vi
            .spyOn(queryExplainerService, "verifyQuery")
            .mockReturnValue(of(mockVerifyQueryResponseSuccess));
        fetchCommitmentDataByUploadTokenSpy = vi
            .spyOn(queryExplainerService, "fetchCommitmentDataByUploadToken")
            .mockReturnValue(of(mockQueryExplainerResponse));
        vi.spyOn(datasetService, "requestDatasetInfoById").mockReturnValue(of(mockDatasetByIdQuery));
        fixture = TestBed.createComponent(QueryExplainerComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "uploadToken", "");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check `Verify commitment` button is disabled", () => {
        fixture.detectChanges();
        checkButtonDisabled(fixture, "verify-commitment-button", true);
    });

    it("should check error message when commitment is incorrect", () => {
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");
        setFieldValue(fixture, "input-textarea", "incorrect commitment");
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "verify-commitment-button");
        expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Impossible to parse the commitment");
    });

    it("should keep the commitment form when the pasted JSON is not a commitment", async () => {
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");
        setFieldValue(fixture, "input-textarea", "{}");
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "verify-commitment-button");
        await fixture.whenStable();
        fixture.detectChanges();

        expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Impossible to parse the commitment");
        expect(findElementByDataTestId(fixture, "input-textarea")).toBeDefined();
    });

    it("should check text area is not empty", () => {
        fixture.detectChanges();
        setFieldValue(fixture, "input-textarea", mockTextareaCommitment);
        fixture.detectChanges();
        expect(component.commitment).toEqual(mockTextareaCommitment);
    });

    it("should show the commitment form when the uploaded commitment cannot be loaded", async () => {
        // A failed request completes without a value, after the response arrives
        fetchCommitmentDataByUploadTokenSpy.mockReturnValue(timer(0).pipe(ignoreElements()));
        fixture = TestBed.createComponent(QueryExplainerComponent);
        setComponentInput(fixture, "uploadToken", "uploaded-token");
        fixture.detectChanges();
        expect(findElementByDataTestId(fixture, "input-textarea")).toBeUndefined();

        await fixture.whenStable();
        fixture.detectChanges();

        expect(findElementByDataTestId(fixture, "input-textarea")).toBeDefined();
    });

    it("should return to the commitment form with the pasted text when verification fails", async () => {
        vi.spyOn(queryExplainerService, "processQueryWithSchema").mockReturnValue(
            of({ output: mockQueryExplainerOutput }),
        );
        // A failed request completes without a value, after the response arrives
        verifyQuerySpy.mockReturnValue(timer(0).pipe(ignoreElements()));
        const commitment = JSON.stringify(mockQueryExplainerResponse);
        setFieldValue(fixture, "input-textarea", commitment);
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "verify-commitment-button");
        await fixture.whenStable();
        fixture.detectChanges();
        expect(findElementByDataTestId(fixture, "input-textarea")).toBeUndefined();

        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.whenStable();

        const textarea = getElementByDataTestId(fixture, "input-textarea", HTMLTextAreaElement);
        expect(textarea.value).toEqual(commitment);
    });
});
