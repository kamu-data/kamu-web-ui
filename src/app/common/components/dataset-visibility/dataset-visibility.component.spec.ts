/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { mockPrivateDatasetVisibility, mockPublicDatasetVisibility } from "src/app/search/mock.data";

import { DatasetVisibilityComponent } from "@common/components/dataset-visibility/dataset-visibility.component";
import { findElementByDataTestId } from "@common/helpers/base-test.helpers.spec";

describe("DatasetVisibilityComponent", () => {
    let component: DatasetVisibilityComponent;
    let fixture: ComponentFixture<DatasetVisibilityComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DatasetVisibilityComponent],
        });
        fixture = TestBed.createComponent(DatasetVisibilityComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check dataset visibility is public", () => {
        component.datasetVisibility = mockPublicDatasetVisibility;
        fixture.detectChanges();
        const badgeElemnet = findElementByDataTestId(fixture, "dataset-visibility") as HTMLSpanElement;
        expect(badgeElemnet.textContent?.trim()).toEqual("Public");
    });

    it("should check dataset visibility is private", () => {
        component.datasetVisibility = mockPrivateDatasetVisibility;
        fixture.detectChanges();
        const badgeElemnet = findElementByDataTestId(fixture, "dataset-visibility") as HTMLSpanElement;
        expect(badgeElemnet.textContent?.trim()).toEqual("Private");
    });
});
