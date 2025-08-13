/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InputDataSectionComponent } from "./input-data-section.component";
import {
    mockDatasetNotFoundError,
    mockDatasetBlockNotFoundError,
    mockQueryExplainerResponse,
    mockVerifyQueryResponseSuccess,
} from "../../query-explainer.mocks";
import { provideToastr } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { mockDatasetInfo } from "src/app/search/mock.data";
import ProjectLinks from "src/app/project-links";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { findElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { MarkdownModule } from "ngx-markdown";
import { HIGHLIGHT_OPTIONS_PROVIDER } from "src/app/common/helpers/app.helpers";
import { MarkdownFormatPipe } from "src/app/common/pipes/markdown-format.pipe";

describe("InputDataSectionComponent", () => {
    let component: InputDataSectionComponent;
    let fixture: ComponentFixture<InputDataSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, MarkdownModule.forRoot(), InputDataSectionComponent, MarkdownFormatPipe],
            providers: [
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case ProjectLinks.URL_QUERY_PARAM_COMMITMENT_UPLOAD_TOKEN:
                                            return "test-upload-token";
                                    }
                                },
                            },
                        },
                    },
                },
                HIGHLIGHT_OPTIONS_PROVIDER,
            ],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(InputDataSectionComponent);
        component = fixture.componentInstance;
        component.inputData = {
            sqlQueryExplainerResponse: mockQueryExplainerResponse,
            sqlQueryVerify: mockVerifyQueryResponseSuccess,
        };
        component.blockHashObservables$ = [of(new Date("2024-10-22T11:54:24.234Z"))];
        component.datasetInfoObservables$ = [of(mockDatasetInfo)];
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check display data", () => {
        fixture.detectChanges();
        const queryDialectElem = findElementByDataTestId(fixture, "input-query-dialect");
        expect(queryDialectElem?.innerText.trim()).toEqual("SqlDataFusion");
        const dataFormatElem = findElementByDataTestId(fixture, "input-data-format");
        expect(dataFormatElem?.innerText.trim()).toEqual("JsonAoA");
        const schemaElem = findElementByDataTestId(fixture, "input-schema-format");
        expect(schemaElem?.innerText.trim()).toEqual("ArrowJson");
        const limitElem = findElementByDataTestId(fixture, "input-limit");
        expect(limitElem?.innerText.trim()).toEqual("100");
        const skipElem = findElementByDataTestId(fixture, "input-skip");
        expect(skipElem?.innerText.trim()).toEqual("0");
        const datasetIdElem = findElementByDataTestId(fixture, "input-dataset-id-0");
        expect(datasetIdElem?.innerText.trim()).toEqual(
            "did:odf:fed01df8964328b3b36fdfc5b140c5aea8795d445403a577428b2eafa5111f47dc212",
        );
        const datasetAliasElem = findElementByDataTestId(fixture, "input-dataset-alias-0");
        expect(datasetAliasElem?.innerText.trim()).toEqual("account.tokens.portfolio");
    });

    it("should check DatasetBlockNotFoundError error is exist", () => {
        component.inputData = {
            sqlQueryExplainerResponse: mockQueryExplainerResponse,
            sqlQueryVerify: mockDatasetBlockNotFoundError,
        };
        fixture.detectChanges();
        const hashElem = findElementByDataTestId(fixture, "input-dataset-hash");
        expect(hashElem?.classList.contains("error-color")).toBeTrue();
    });

    it("should check isDatasetNotFoundError error is exist", () => {
        component.inputData = {
            sqlQueryExplainerResponse: mockQueryExplainerResponse,
            sqlQueryVerify: mockDatasetNotFoundError,
        };
        fixture.detectChanges();
        const hashElem = findElementByDataTestId(fixture, "input-dataset-id-0");
        expect(hashElem?.classList.contains("error-color")).toBeTrue();
    });
});
