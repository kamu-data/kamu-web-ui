/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import { requireValue } from "@common/helpers/app.helpers";
import { setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewWithSetLicense,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { EditLicenseModalComponent } from "src/app/dataset-view/additional-components/overview-component/components/edit-license-modal/edit-license-modal.component";
import { EditLicenseModalHarness } from "src/app/dataset-view/additional-components/overview-component/components/edit-license-modal/edit-license-modal.harness";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";

describe("EditLicenseModalComponent", () => {
    let component: EditLicenseModalComponent;
    let fixture: ComponentFixture<EditLicenseModalComponent>;
    let datasetCommitService: DatasetCommitService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EditLicenseModalComponent],
            providers: [Apollo, NgbActiveModal, provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        datasetCommitService = TestBed.inject(DatasetCommitService);
        vi.spyOn(TestBed.inject(LoggedUserService), "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        fixture = TestBed.createComponent(EditLicenseModalComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsDerivedFragment);
        setComponentInput(fixture, "currentState", {
            schema: mockMetadataDerivedUpdate.schema,
            data: mockOverviewDataUpdate.content,
            overview: mockOverviewWithSetLicense,
            size: mockOverviewDataUpdate.size,
        });
        fixture.detectChanges();
    });

    function editLicenseHarness(): Promise<EditLicenseModalHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, EditLicenseModalHarness);
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check initialize form", async () => {
        const license = requireValue(mockOverviewWithSetLicense.metadata.currentLicense);
        const modal = await editLicenseHarness();

        expect(await modal.getValue("name")).toBe(license.name);
        expect(await modal.getValue("shortName")).toBe(license.shortName);
        expect(await modal.getValue("websiteUrl")).toBe(license.websiteUrl);
        expect(component.licenseForm.controls.spdxId.value).toBe(license.spdxId ?? null);
    });

    [
        { field: "name" as const, label: "Name" },
        { field: "shortName" as const, label: "Short name" },
        { field: "websiteUrl" as const, label: "Url" },
    ].forEach(({ field, label }) => {
        it(`should require the ${field}`, async () => {
            const modal = await editLicenseHarness();

            await modal.setValue(field, "");

            expect(await modal.getError(field)).toBe(`${label} is required`);
            expect(await modal.isSaveDisabled()).toBe(true);
        });
    });

    [
        { field: "name" as const, label: "Name" },
        { field: "shortName" as const, label: "Short name" },
    ].forEach(({ field, label }) => {
        it(`should not accept a blank ${field}`, async () => {
            const modal = await editLicenseHarness();

            await modal.setValue(field, "   ");

            expect(await modal.getError(field)).toBe(`${label} can't be blank`);
            expect(await modal.isSaveDisabled()).toBe(true);
        });
    });

    ["bad url", "ftp://example.com/license", "example.com/license"].forEach((url) => {
        it(`should reject the website URL "${url}"`, async () => {
            const modal = await editLicenseHarness();

            await modal.setValue("websiteUrl", url);

            expect(await modal.getError("websiteUrl")).toBe("Url must be a URL starting with http://, https://");
            expect(await modal.isSaveDisabled()).toBe(true);
        });
    });

    it("should not save while the form is invalid", async () => {
        const commitSpy = vi.spyOn(datasetCommitService, "commitEventToDataset");
        const modal = await editLicenseHarness();

        await modal.setValue("name", "");
        await modal.save();

        expect(commitSpy).not.toHaveBeenCalled();
    });

    ["http://example.com/license", "https://example.com/license"].forEach((url) => {
        it(`should save the license with the website URL "${url}"`, async () => {
            const commitSpy = vi.spyOn(datasetCommitService, "commitEventToDataset").mockReturnValue(of());
            const buildEventSpy = vi.spyOn(TestBed.inject(TemplatesYamlEventsService), "buildYamlSetLicenseEvent");
            const closeSpy = stubMethod(TestBed.inject(NgbActiveModal), "close");
            const modal = await editLicenseHarness();

            await modal.setValue("name", "My License");
            await modal.setValue("shortName", "ML");
            await modal.setValue("websiteUrl", url);
            expect(await modal.isSaveDisabled()).toBe(false);
            await modal.save();

            expect(buildEventSpy).toHaveBeenCalledWith(
                expect.objectContaining({ name: "My License", shortName: "ML", websiteUrl: url }),
            );
            expect(commitSpy).toHaveBeenCalledTimes(1);
            expect(closeSpy).toHaveBeenCalledTimes(1);
        });
    });
});
