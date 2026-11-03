/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import {
    findElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { mockDerivedOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import {
    atOlderCommit,
    mockLatestRootSnapshotWithLicense,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.mock";
import { MetadataLicenseTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-license-tab/metadata-license-tab.component";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
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
            providers: [Apollo, provideHttpClient(), provideHttpClientTesting()],
        });
        registerMatSvgIcons();

        fixture = TestBed.createComponent(MetadataLicenseTabComponent);
        modalService = TestBed.inject(NgbModal);
        component = fixture.componentInstance;

        setComponentInput(fixture, "datasetMetadataTabData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            snapshot: mockLatestRootSnapshotWithLicense,
        });

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to open edit window", () => {
        TestBed.inject(DatasetSubscriptionsService).emitOverviewChanged(mockDerivedOverviewUpdate);
        const openModalSpy = vi.spyOn(modalService, "open");
        component.onEditLicense();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to show license", () => {
        const licenseShortName = findElementByDataTestId(fixture, "license-short-name");
        expect(licenseShortName?.innerText.trim()).toEqual(mockMetadataCurrentLicense.shortName);
        const licenseName = findElementByDataTestId(fixture, "license-name");
        expect(licenseName?.innerText.trim()).toEqual(mockMetadataCurrentLicense.name);
        const licenseSpdxId = findElementByDataTestId(fixture, "license-spdxId");
        expect(licenseSpdxId?.innerText.trim()).toEqual(mockMetadataCurrentLicense.spdxId);
        const licenseWebsiteUrl = findElementByDataTestId(fixture, "license-websiteUrl");
        expect(licenseWebsiteUrl?.innerText.trim()).toEqual(mockMetadataCurrentLicense.websiteUrl);
    });

    it("should show the license as of an older commit without the edit button", () => {
        expect(findElementByDataTestId(fixture, "edit-license")).toBeDefined();

        setComponentInput(fixture, "datasetMetadataTabData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            snapshot: atOlderCommit(mockLatestRootSnapshotWithLicense),
        });
        fixture.detectChanges();

        expect(findElementByDataTestId(fixture, "license-short-name")?.innerText.trim()).toEqual(
            mockMetadataCurrentLicense.shortName,
        );
        expect(findElementByDataTestId(fixture, "edit-license")).toBeUndefined();
    });
});
