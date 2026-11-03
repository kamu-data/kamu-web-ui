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

import {
    findElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";

import {
    atOlderCommit,
    mockLatestDerivedSnapshot,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.mock";
import { MetadataSchemaTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-schema-tab/metadata-schema-tab.component";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("MetadataSchemaTabComponent", () => {
    let component: MetadataSchemaTabComponent;
    let fixture: ComponentFixture<MetadataSchemaTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataSchemaTabComponent],
            providers: [provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });
        registerMatSvgIcons();
        fixture = TestBed.createComponent(MetadataSchemaTabComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetMetadataTabData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            snapshot: mockLatestDerivedSnapshot,
        });

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should show the schema as of an older commit without the edit button", () => {
        setComponentInput(fixture, "datasetMetadataTabData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            snapshot: atOlderCommit(mockLatestDerivedSnapshot),
        });
        fixture.detectChanges();

        expect(component.schema).toEqual(mockLatestDerivedSnapshot.schema);
        expect(findElementByDataTestId(fixture, "edit-schema")).toBeUndefined();
    });
});
