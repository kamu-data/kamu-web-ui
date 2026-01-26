/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SharedTestModule } from "./../common/modules/shared-test.module";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { QueryExplainerComponent } from "./query-explainer.component";
import { of } from "rxjs";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideToastr, ToastrService } from "ngx-toastr";
import { Apollo } from "apollo-angular";
import { QueryExplainerService } from "./query-explainer.service";
import {
    mockQueryExplainerResponse,
    mockTextareaCommitment,
    mockVerifyQueryResponseSuccess,
} from "./query-explainer.mocks";
import { DatasetService } from "../dataset-view/dataset.service";
import { mockDatasetByIdQuery } from "../api/mock/dataset.mock";
import {
    checkButtonDisabled,
    emitClickOnElementByDataTestId,
    registerMatSvgIcons,
    setFieldValue,
} from "../common/helpers/base-test.helpers.spec";
import { HIGHLIGHT_OPTIONS_PROVIDER } from "../common/helpers/app.helpers";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("QueryExplainerComponent", () => {
    let component: QueryExplainerComponent;
    let fixture: ComponentFixture<QueryExplainerComponent>;
    let queryExplainerService: QueryExplainerService;
    let datasetService: DatasetService;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [SharedTestModule, QueryExplainerComponent],
    providers: [Apollo, provideToastr(), HIGHLIGHT_OPTIONS_PROVIDER, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

        registerMatSvgIcons();

        datasetService = TestBed.inject(DatasetService);
        toastrService = TestBed.inject(ToastrService);
        queryExplainerService = TestBed.inject(QueryExplainerService);
        spyOn(queryExplainerService, "verifyQuery").and.returnValue(of(mockVerifyQueryResponseSuccess));
        spyOn(queryExplainerService, "fetchCommitmentDataByUploadToken").and.returnValue(
            of(mockQueryExplainerResponse),
        );
        spyOn(datasetService, "requestDatasetInfoById").and.returnValue(of(mockDatasetByIdQuery));
        fixture = TestBed.createComponent(QueryExplainerComponent);
        component = fixture.componentInstance;
        component.uploadToken = "";
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
        const toastrServiceErrorSpy = spyOn(toastrService, "error");
        setFieldValue(fixture, "input-textarea", "incorrect commitment");
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "verify-commitment-button");
        expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Impossible to parse the commitment");
    });

    it("should check text area is not empty", () => {
        fixture.detectChanges();
        setFieldValue(fixture, "input-textarea", mockTextareaCommitment);
        fixture.detectChanges();
        expect(component.commitment).toEqual(mockTextareaCommitment);
    });
});
