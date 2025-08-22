/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetadataTransformationTabComponent } from "./metadata-transformation-tab.component";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "../../../data-tabs.mock";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("MetadataTransformationTabComponent", () => {
    let component: MetadataTransformationTabComponent;
    let fixture: ComponentFixture<MetadataTransformationTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataTransformationTabComponent, HttpClientTestingModule],
        });
        fixture = TestBed.createComponent(MetadataTransformationTabComponent);
        component = fixture.componentInstance;
        component.datasetMetadataTabData = {
            datasetBasics: structuredClone(mockDatasetBasicsDerivedFragment),
            datasetPermissions: structuredClone(mockFullPowerDatasetPermissionsFragment),
            overviewUpdate: {
                schema: mockMetadataDerivedUpdate.schema,
                content: mockOverviewDataUpdate.content,
                overview: structuredClone(mockOverviewDataUpdateNullable.overview),
                size: mockOverviewDataUpdate.size,
            } as OverviewUpdate,
        };
        registerMatSvgIcons();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
