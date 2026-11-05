/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HIGHLIGHT_OPTIONS_PROVIDER, requireValue } from "@common/helpers/app.helpers";
import {
    findElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { mockSetTransformWithPrivateInput } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";
import {
    atOlderCommit,
    mockLatestDerivedSnapshot,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.mock";
import { MetadataTransformationTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-transformation-tab/metadata-transformation-tab.component";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("MetadataTransformationTabComponent", () => {
    let component: MetadataTransformationTabComponent;
    let fixture: ComponentFixture<MetadataTransformationTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataTransformationTabComponent, SharedTestModule],
            providers: [HIGHLIGHT_OPTIONS_PROVIDER, provideHttpClient(), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(MetadataTransformationTabComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetMetadataTabData", {
            datasetBasics: structuredClone(mockDatasetBasicsDerivedFragment),
            datasetPermissions: structuredClone(mockFullPowerDatasetPermissionsFragment),
            snapshot: mockLatestDerivedSnapshot,
        });
        registerMatSvgIcons();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should hide the edit button as of an older commit", () => {
        expect(findElementByDataTestId(fixture, "edit-transformation-link")).toBeDefined();

        setComponentInput(fixture, "datasetMetadataTabData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            snapshot: atOlderCommit(mockLatestDerivedSnapshot),
        });
        fixture.detectChanges();

        expect(findElementByDataTestId(fixture, "dataset-name-button-0")).toBeDefined();
        expect(findElementByDataTestId(fixture, "edit-transformation-link")).toBeUndefined();
    });

    it("should show each input's query alias, not its dataset's alias", () => {
        const input = requireValue(mockLatestDerivedSnapshot.transform).inputs[0];

        expect(getElementByDataTestId(fixture, "input-query-alias-0").textContent.trim()).toEqual(input.alias);
    });

    it("should show the query alias of an input whose dataset is not accessible", () => {
        fixture.destroy();
        fixture = TestBed.createComponent(MetadataTransformationTabComponent);
        setComponentInput(fixture, "datasetMetadataTabData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            snapshot: { ...mockLatestDerivedSnapshot, transform: mockSetTransformWithPrivateInput },
        });
        fixture.detectChanges();

        expect(getElementByDataTestId(fixture, "input-query-alias-0").textContent.trim()).toEqual(
            mockSetTransformWithPrivateInput.inputs[0].alias,
        );
    });
});
