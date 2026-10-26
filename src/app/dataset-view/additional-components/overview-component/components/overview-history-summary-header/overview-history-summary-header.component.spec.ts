/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import { AccountProvider } from "@api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import { OverviewHistorySummaryHeaderComponent } from "src/app/dataset-view/additional-components/overview-component/components/overview-history-summary-header/overview-history-summary-header.component";

describe("OverviewHistorySummaryHeaderComponent", () => {
    let component: OverviewHistorySummaryHeaderComponent;
    let fixture: ComponentFixture<OverviewHistorySummaryHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, OverviewHistorySummaryHeaderComponent],
            providers: [provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(OverviewHistorySummaryHeaderComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput(
            "metadataBlockFragment",
            mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain.blockByHash,
        );
        fixture.componentRef.setInput("numBlocksTotal", 3);
        fixture.componentRef.setInput("datasetName", TEST_DATASET_NAME);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check default values", () => {
        fixture.componentRef.setInput("metadataBlockFragment", undefined);
        fixture.detectChanges();

        expect(component.descriptionForMetadataBlock).toBe("");
        expect(component.authorInfo).toEqual({
            id: "",
            accountName: AppValues.DEFAULT_USER_DISPLAY_NAME,
            avatarUrl: AppValues.DEFAULT_AVATAR_URL,
            accountProvider: AccountProvider.Password,
        });
        expect(component.systemTime).toBe("");
    });
});
