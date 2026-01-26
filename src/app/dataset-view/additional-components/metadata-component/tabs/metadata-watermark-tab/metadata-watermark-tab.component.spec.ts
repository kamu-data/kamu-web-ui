/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetadataWatermarkTabComponent } from "./metadata-watermark-tab.component";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "../../../data-tabs.mock";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("MetadataWatermarkTabComponent", () => {
    let component: MetadataWatermarkTabComponent;
    let fixture: ComponentFixture<MetadataWatermarkTabComponent>;
    let modalService: NgbModal;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [MetadataWatermarkTabComponent, SharedTestModule],
    providers: [Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
        fixture = TestBed.createComponent(MetadataWatermarkTabComponent);
        modalService = TestBed.inject(NgbModal);
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

    it("should check to open edit window", () => {
        const openModalSpy = spyOn(modalService, "open").and.callThrough();
        component.onEditWatermark();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });
});
