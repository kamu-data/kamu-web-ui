/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SharedTestModule } from "./../common/modules/shared-test.module";
import { CommitmentDataSectionComponent } from "./components/commitment-data-section/commitment-data-section.component";
import { InputDataSectionComponent } from "./components/input-data-section/input-data-section.component";
import { VerifyResultSectionComponent } from "./components/verify-result-section/verify-result-section.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { QueryExplainerComponent } from "./query-explainer.component";
import { RouterModule } from "@angular/router";
import { of } from "rxjs";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { Apollo } from "apollo-angular";
import { QueryExplainerService } from "./query-explainer.service";
import {
    mockQueryExplainerResponse,
    mockTextareaCommitment,
    mockVerifyQueryResponseSuccess,
} from "./query-explainer.mocks";
import { HIGHLIGHT_OPTIONS, HighlightModule } from "ngx-highlightjs";
import { ReproducedResultSectionComponent } from "./components/reproduced-result-section/reproduced-result-section.component";
import { DisplayHashModule } from "../common/components/display-hash/display-hash.module";
import { DynamicTableModule } from "../common/components/dynamic-table/dynamic-table.module";
import { DatasetService } from "../dataset-view/dataset.service";
import { mockDatasetByIdQuery } from "../api/mock/dataset.mock";
import {
    checkButtonDisabled,
    emitClickOnElementByDataTestId,
    registerMatSvgIcons,
    setFieldValue,
} from "../common/helpers/base-test.helpers.spec";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

describe("QueryExplainerComponent", () => {
    let component: QueryExplainerComponent;
    let fixture: ComponentFixture<QueryExplainerComponent>;
    let queryExplainerService: QueryExplainerService;
    let datasetService: DatasetService;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [
        HttpClientTestingModule,
        DynamicTableModule,
        ToastrModule.forRoot(),
        DisplayHashModule,
        HighlightModule,
        RouterModule,
        FormsModule,
        MatIconModule,
        SharedTestModule,
        QueryExplainerComponent,
        VerifyResultSectionComponent,
        ReproducedResultSectionComponent,
        InputDataSectionComponent,
        CommitmentDataSectionComponent,
    ],
    providers: [
        Apollo,
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import("highlight.js/lib/core"),
                languages: {
                    sql: () => import("highlight.js/lib/languages/sql"),
                },
            },
        },
    ],
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
