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
import AppValues from "@common/values/app.values";
import { provideToastr } from "ngx-toastr";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import { mockPageBasedInfo } from "src/app/search/mock.data";

import { SharedTestModule } from "../../modules/shared-test.module";
import { TimelineComponent } from "./timeline.component";

describe("TimelineComponent", () => {
    let component: TimelineComponent;
    let fixture: ComponentFixture<TimelineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, TimelineComponent],
            providers: [provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(TimelineComponent);
        component = fixture.componentInstance;
        component.datasetName = TEST_DATASET_NAME;
        component.pageInfo = mockPageBasedInfo;
        component.history = [
            mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain.blockByHash as MetadataBlockFragment,
        ];

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check avatar url", () => {
        const imageElement = findElementByDataTestId(fixture, "timeline-avatarUrl-0") as HTMLImageElement;
        const src = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain.blockByHash?.author.avatarUrl;
        const result = src ? src : AppValues.DEFAULT_AVATAR_URL;
        expect(imageElement.src).toEqual(result);
    });
});
