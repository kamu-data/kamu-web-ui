/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import { registerMatSvgIcons, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { mockDerivedOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataWatermarkTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-watermark-tab/metadata-watermark-tab.component";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("MetadataWatermarkTabComponent", () => {
    let component: MetadataWatermarkTabComponent;
    let fixture: ComponentFixture<MetadataWatermarkTabComponent>;
    let modalService: NgbModal;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataWatermarkTabComponent, SharedTestModule],
            providers: [Apollo, provideHttpClient(), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(MetadataWatermarkTabComponent);
        modalService = TestBed.inject(NgbModal);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetMetadataTabData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockDerivedOverviewUpdate,
        });
        registerMatSvgIcons();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to open edit window", () => {
        const openModalSpy = vi.spyOn(modalService, "open");
        component.onEditWatermark();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });
});
