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

import { TimelineComponent } from "@common/components/timeline-component/timeline.component";
import {
    findElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import { mockMetadataBlockByHash, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import { mockPageBasedInfo } from "src/app/search/mock.data";

describe("TimelineComponent", () => {
    let component: TimelineComponent;
    let fixture: ComponentFixture<TimelineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, TimelineComponent],
            providers: [provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(TimelineComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetName", TEST_DATASET_NAME);
        setComponentInput(fixture, "pageInfo", mockPageBasedInfo);
        setComponentInput(fixture, "history", [mockMetadataBlockByHash]);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check avatar url", () => {
        const imageElement = findElementByDataTestId(fixture, "timeline-avatarUrl-0") as HTMLImageElement;
        const src = mockMetadataBlockByHash.author.avatarUrl;
        const result = src ? src : AppValues.DEFAULT_AVATAR_URL;
        expect(imageElement.src).toEqual(result);
    });
});
