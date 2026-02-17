/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";
import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataSchemaTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-schema-tab/metadata-schema-tab.component";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";

describe("MetadataSchemaTabComponent", () => {
    let component: MetadataSchemaTabComponent;
    let fixture: ComponentFixture<MetadataSchemaTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataSchemaTabComponent],
            providers: [provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(MetadataSchemaTabComponent);
        component = fixture.componentInstance;
        component.datasetMetadataTabData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
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
