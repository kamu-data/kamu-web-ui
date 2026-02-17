/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";

import { findElementByDataTestId, registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataLicenseTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-license-tab/metadata-license-tab.component";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import {
    mockDatasetBasicsDerivedFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockMetadataCurrentLicense,
} from "src/app/search/mock.data";

describe("MetadataLicenseTabComponent", () => {
    let component: MetadataLicenseTabComponent;
    let fixture: ComponentFixture<MetadataLicenseTabComponent>;
    let modalService: NgbModal;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataLicenseTabComponent, MatIconModule, SharedTestModule],
            providers: [Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        registerMatSvgIcons();

        fixture = TestBed.createComponent(MetadataLicenseTabComponent);
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

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to open edit window", () => {
        const openModalSpy = spyOn(modalService, "open").and.callThrough();
        component.onEditLicense();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to show license", () => {
        const licenseShortName = findElementByDataTestId(fixture, "license-short-name");
        expect(licenseShortName?.innerText.trim()).toEqual(mockMetadataCurrentLicense.shortName);
        const licenseName = findElementByDataTestId(fixture, "license-name");
        expect(licenseName?.innerText.trim()).toEqual(mockMetadataCurrentLicense.name);
        const licenseSpdxId = findElementByDataTestId(fixture, "license-spdxId");
        expect(licenseSpdxId?.innerText.trim()).toEqual(mockMetadataCurrentLicense.spdxId as string);
        const licenseWebsiteUrl = findElementByDataTestId(fixture, "license-websiteUrl");
        expect(licenseWebsiteUrl?.innerText.trim()).toEqual(mockMetadataCurrentLicense.websiteUrl);
    });
});
