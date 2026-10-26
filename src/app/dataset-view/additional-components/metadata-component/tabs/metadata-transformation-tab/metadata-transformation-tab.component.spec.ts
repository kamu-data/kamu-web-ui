/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import RoutingResolvers from "@common/resolvers/routing-resolvers";

import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataTransformationTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-transformation-tab/metadata-transformation-tab.component";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("MetadataTransformationTabComponent", () => {
    let component: MetadataTransformationTabComponent;
    let fixture: ComponentFixture<MetadataTransformationTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataTransformationTabComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(MetadataTransformationTabComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput(RoutingResolvers.METADATA_TRANSFORMATION_TAB_KEY, {
            datasetBasics: structuredClone(mockDatasetBasicsDerivedFragment),
            datasetPermissions: structuredClone(mockFullPowerDatasetPermissionsFragment),
            overviewUpdate: {
                schema: mockMetadataDerivedUpdate.schema,
                content: mockOverviewDataUpdate.content,
                overview: structuredClone(mockOverviewDataUpdateNullable.overview),
                size: mockOverviewDataUpdate.size,
            } as OverviewUpdate,
        } satisfies DatasetOverviewTabData);
        registerMatSvgIcons();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
