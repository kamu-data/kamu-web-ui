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

import { NEVER, of, throwError } from "rxjs";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { Mock } from "vitest";

import { requireValue } from "@common/helpers/app.helpers";
import { captureUnhandledRxjsErrors, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { ErrorTexts } from "@common/values/errors.text";
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
import { mockCommitEventToDatasetErrorMessage, mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
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

    /** Answers commits the way the service does when the backend refuses the event. */
    function stubRefusedCommit(): Mock<DatasetCommitService["commitEventToDataset"]> {
        const commitService = TestBed.inject(DatasetCommitService);
        return vi.spyOn(commitService, "commitEventToDataset").mockImplementation(() => {
            commitService.emitCommitEventErrorOccurred(mockCommitEventToDatasetErrorMessage);
            return of(false);
        });
    }

    /** Answers commits the way the service does when the backend accepts the event. */
    function acceptCommits(spy: Mock<DatasetCommitService["commitEventToDataset"]>): void {
        spy.mockImplementation(() => {
            TestBed.inject(DatasetCommitService).emitCommitEventErrorOccurred("");
            return of(true);
        });
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
            const commitSpy = vi.spyOn(datasetCommitService, "commitEventToDataset").mockReturnValue(of(true));
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

    it("should stay open with the license entered when the commit request fails", async () => {
        const unhandledErrors = captureUnhandledRxjsErrors();
        vi.spyOn(datasetCommitService, "commitEventToDataset").mockReturnValue(
            throwError(() => new Error("Server unreachable")),
        );
        const closeSpy = stubMethod(TestBed.inject(NgbActiveModal), "close");
        const modal = await editLicenseHarness();

        await modal.setValue("name", "My License");
        await modal.setValue("shortName", "ML");
        await modal.setValue("websiteUrl", "https://example.com/license");
        await modal.save();

        expect(closeSpy).not.toHaveBeenCalled();
        expect(await modal.getValue("name")).toBe("My License");
        expect(await modal.getValue("shortName")).toBe("ML");
        expect(await modal.getValue("websiteUrl")).toBe("https://example.com/license");
        expect(await modal.isSaveDisabled()).toBe(false);
        await vi.waitFor(() => expect(unhandledErrors).toHaveBeenCalledWith(new Error("Server unreachable")));
    });

    it("should show no commit error before a save", async () => {
        const modal = await editLicenseHarness();

        expect(await modal.getCommitError()).toBeNull();
    });

    it("should stay open with the license entered and show why when the backend refuses it", async () => {
        stubRefusedCommit();
        const closeSpy = stubMethod(TestBed.inject(NgbActiveModal), "close");
        const modal = await editLicenseHarness();

        await modal.setValue("name", "My License");
        await modal.setValue("shortName", "ML");
        await modal.setValue("websiteUrl", "https://example.com/license");
        await modal.save();

        expect(closeSpy).not.toHaveBeenCalled();
        expect(await modal.getValue("name")).toBe("My License");
        expect(await modal.getValue("shortName")).toBe("ML");
        expect(await modal.getValue("websiteUrl")).toBe("https://example.com/license");
        const error = await modal.getCommitError();
        expect(error).toContain(ErrorTexts.ERROR_METADATA_EVENT_REFUSED);
        expect(error).toContain(mockCommitEventToDatasetErrorMessage);
        expect(await modal.isSaveDisabled()).toBe(false);
    });

    it("should close once a save after a refused one succeeds", async () => {
        const commitSpy = stubRefusedCommit();
        const closeSpy = stubMethod(TestBed.inject(NgbActiveModal), "close");
        const modal = await editLicenseHarness();
        await modal.save();

        acceptCommits(commitSpy);
        await modal.save();

        expect(commitSpy).toHaveBeenCalledTimes(2);
        expect(closeSpy).toHaveBeenCalledTimes(1);
        expect(await modal.getCommitError()).toBeNull();
    });

    it("should drop the refusal message when the next save fails to reach the backend", async () => {
        const unhandledErrors = captureUnhandledRxjsErrors();
        const commitSpy = stubRefusedCommit();
        stubMethod(TestBed.inject(NgbActiveModal), "close");
        const modal = await editLicenseHarness();
        await modal.save();

        commitSpy.mockReturnValue(throwError(() => new Error("Server unreachable")));
        await modal.save();

        expect(await modal.getCommitError()).toBeNull();
        await vi.waitFor(() => expect(unhandledErrors).toHaveBeenCalledWith(new Error("Server unreachable")));
    });

    it("should not commit an invalid license submitted from the form", async () => {
        const commitSpy = vi.spyOn(datasetCommitService, "commitEventToDataset");
        const modal = await editLicenseHarness();

        await modal.setValue("name", "");
        await modal.submitForm();

        expect(commitSpy).not.toHaveBeenCalled();
    });

    it("should not commit the license again when the form is submitted while it is being committed", async () => {
        const commitSpy = vi.spyOn(datasetCommitService, "commitEventToDataset").mockReturnValue(NEVER);
        const modal = await editLicenseHarness();

        await modal.save();
        await modal.submitForm();

        expect(commitSpy).toHaveBeenCalledTimes(1);
    });

    it("should keep Save disabled while the license is being committed", async () => {
        const commitSpy = vi.spyOn(datasetCommitService, "commitEventToDataset").mockReturnValue(NEVER);
        const modal = await editLicenseHarness();

        await modal.save();
        await modal.save();

        expect(await modal.isSaveDisabled()).toBe(true);
        expect(commitSpy).toHaveBeenCalledTimes(1);
    });
});
