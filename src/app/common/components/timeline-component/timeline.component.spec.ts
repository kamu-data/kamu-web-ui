/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TimelineComponent } from "./timeline.component";
import { TEST_DATASET_NAME, mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { mockPageBasedInfo } from "src/app/search/mock.data";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { findElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { provideToastr } from "ngx-toastr";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import AppValues from "src/app/common/values/app.values";
import { SharedTestModule } from "../../modules/shared-test.module";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

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
