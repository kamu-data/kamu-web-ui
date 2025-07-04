/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OverviewHistorySummaryHeaderComponent } from "./overview-history-summary-header.component";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { TEST_DATASET_NAME, mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideToastr } from "ngx-toastr";
import AppValues from "src/app/common/values/app.values";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("OverviewHistorySummaryHeaderComponent", () => {
    let component: OverviewHistorySummaryHeaderComponent;
    let fixture: ComponentFixture<OverviewHistorySummaryHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [provideToastr()],
            imports: [HttpClientTestingModule, SharedTestModule, OverviewHistorySummaryHeaderComponent],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(OverviewHistorySummaryHeaderComponent);
        component = fixture.componentInstance;
        (component.metadataBlockFragment = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
            .blockByHash as MetadataBlockFragment),
            (component.numBlocksTotal = 3);
        component.datasetName = TEST_DATASET_NAME;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check default values", () => {
        component.metadataBlockFragment = undefined;

        fixture.detectChanges();

        expect(component.descriptionForMetadataBlock).toBe("");
        expect(component.authorInfo).toEqual({
            id: "",
            accountName: AppValues.DEFAULT_USER_DISPLAY_NAME,
            avatarUrl: AppValues.DEFAULT_AVATAR_URL,
        });
        expect(component.systemTime).toBe("");
    });
});
