/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetadataLicenseTabComponent } from "./metadata-license-tab.component";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import {
    mockDatasetBasicsDerivedFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockMetadataCurrentLicense,
} from "src/app/search/mock.data";
import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "../../../data-tabs.mock";
import { findElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { Apollo } from "apollo-angular";

describe("MetadataLicenseTabComponent", () => {
    let component: MetadataLicenseTabComponent;
    let fixture: ComponentFixture<MetadataLicenseTabComponent>;
    let modalService: NgbModal;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [MetadataLicenseTabComponent, HttpClientTestingModule, MatIconModule, SharedTestModule],
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
        const editLicenseButton = findElementByDataTestId(fixture, "edit-license");
        expect(editLicenseButton).toBeDefined();
        editLicenseButton?.click();
        fixture.detectChanges();
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
