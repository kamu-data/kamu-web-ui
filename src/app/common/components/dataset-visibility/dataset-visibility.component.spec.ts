/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetVisibilityComponent } from "@common/components/dataset-visibility/dataset-visibility.component";
import { getElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";

import { mockPrivateDatasetVisibility, mockPublicDatasetVisibility } from "src/app/search/mock.data";

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
        setComponentInput(fixture, "datasetVisibility", mockPublicDatasetVisibility);
        fixture.detectChanges();
        const badgeElemnet = getElementByDataTestId(fixture, "dataset-visibility", HTMLSpanElement);
        expect(badgeElemnet.textContent?.trim()).toEqual("Public");
    });

    it("should check dataset visibility is private", () => {
        setComponentInput(fixture, "datasetVisibility", mockPrivateDatasetVisibility);
        fixture.detectChanges();
        const badgeElemnet = getElementByDataTestId(fixture, "dataset-visibility", HTMLSpanElement);
        expect(badgeElemnet.textContent?.trim()).toEqual("Private");
    });
});
