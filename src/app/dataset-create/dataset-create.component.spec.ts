/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";

import { requireValue } from "@common/helpers/app.helpers";
import { getElementByDataTestId, registerMatSvgIcons, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { FieldMutationResult } from "@common/validation/server-errors.helpers";
import { DatasetKind, DatasetVisibility } from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetCreateComponent } from "src/app/dataset-create/dataset-create.component";
import { DatasetCreateHarness } from "src/app/dataset-create/dataset-create.harness";
import { DatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { ArchetypeViewType } from "src/app/dataset-create/dataset-create.types";

const CREATED: FieldMutationResult<true> = { ok: true, value: true };

describe("DatasetCreateComponent", () => {
    let component: DatasetCreateComponent;
    let fixture: ComponentFixture<DatasetCreateComponent>;
    let datasetCreateService: DatasetCreateService;
    let loggedUserService: LoggedUserService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, SharedTestModule, DatasetCreateComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        loggedUserService = TestBed.inject(LoggedUserService);
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);

        fixture = TestBed.createComponent(DatasetCreateComponent);
        component = fixture.componentInstance;
        datasetCreateService = TestBed.inject(DatasetCreateService);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize with logged user value in selections", () => {
        expect(component.createDatasetForm.controls.owner.value).toEqual(mockAccountDetails.accountName);
    });

    function datasetCreateHarness(): Promise<DatasetCreateHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, DatasetCreateHarness);
    }

    it("should show a name kamu-cli rejects under the name field until it is changed", async () => {
        vi.spyOn(datasetCreateService, "createEmptyDataset").mockReturnValue(
            of({ ok: false, fieldError: "Dataset with name my-dataset already exists" } as const),
        );
        const page = await datasetCreateHarness();

        await page.setDatasetName("my-dataset");
        await page.create();

        expect(await page.getDatasetNameError()).toBe("Dataset with name my-dataset already exists");
        expect(await page.isCreateDisabled()).toBe(true);
        expect(await page.getCreateError()).toBeNull();

        await page.setDatasetName("my-dataset-2");

        expect(await page.getDatasetNameError()).toBeNull();
        expect(await page.isCreateDisabled()).toBe(false);
    });

    it("should show a snapshot kamu-cli rejects above the form, and drop it when the editor is turned off", async () => {
        vi.spyOn(datasetCreateService, "createDatasetFromSnapshot").mockReturnValue(
            of({ ok: false, fieldError: "Snapshot is invalid" } as const),
        );
        const page = await datasetCreateHarness();
        await page.toggleYamlSnapshot();
        component.yamlTemplate = "kind: DatasetSnapshot";
        fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();

        await page.create();

        expect(await page.getCreateError()).toBe("Snapshot is invalid");
        expect(await page.getDatasetNameError()).toBeNull();

        await page.toggleYamlSnapshot();

        expect(await page.getCreateError()).toBeNull();
    });

    it("should clear the snapshot error once a snapshot is accepted", async () => {
        const createDatasetFromSnapshotSpy = vi
            .spyOn(datasetCreateService, "createDatasetFromSnapshot")
            .mockReturnValue(of({ ok: false, fieldError: "Snapshot is invalid" } as const));
        const page = await datasetCreateHarness();
        await page.toggleYamlSnapshot();
        component.yamlTemplate = "kind: DatasetSnapshot";
        fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
        await page.create();

        createDatasetFromSnapshotSpy.mockReturnValue(of(CREATED));
        await page.create();

        expect(await page.getCreateError()).toBeNull();
    });

    it("should check getter isFormValid()", () => {
        component.yamlTemplate = "testYaml";
        fixture.detectChanges();
        expect(component.isFormValid).toBe(true);
    });

    it("should check call createDatasetFromForm()", () => {
        const createDatasetFromFormSpy = vi
            .spyOn(datasetCreateService, "createEmptyDataset")
            .mockReturnValue(of(CREATED));

        component.onCreateDataset();

        expect(createDatasetFromFormSpy).toHaveBeenCalledTimes(1);
    });

    it("should create a collection for the collection archetype", () => {
        component.archetype = ArchetypeViewType.COLLECTION;
        component.createDatasetForm.patchValue({
            datasetName: "my-collection",
            visibility: DatasetVisibility.Public,
        });
        const createCollectionSpy = vi.spyOn(datasetCreateService, "createCollection").mockReturnValue(of(CREATED));

        component.onCreateDataset();

        expect(createCollectionSpy).toHaveBeenCalledTimes(1);

        expect(createCollectionSpy).toHaveBeenCalledWith({
            datasetAlias: "my-collection",
            datasetVisibility: DatasetVisibility.Public,
        });
    });

    it("should create a versioned file for the versioned file archetype", () => {
        component.archetype = ArchetypeViewType.VERSIONED_FILE;
        component.createDatasetForm.patchValue({
            datasetName: "my-versioned-file",
            visibility: DatasetVisibility.Private,
        });
        const createVersionedFileSpy = vi
            .spyOn(datasetCreateService, "createVersionedFile")
            .mockReturnValue(of(CREATED));

        component.onCreateDataset();

        expect(createVersionedFileSpy).toHaveBeenCalledTimes(1);

        expect(createVersionedFileSpy).toHaveBeenCalledWith({
            datasetAlias: "my-versioned-file",
            datasetVisibility: DatasetVisibility.Private,
        });
    });

    it("should disable structured dataset controls and snapshot initialization for collection", () => {
        component.showMonacoEditor = true;
        component.yamlTemplate = "snapshot";
        component.createDatasetForm.controls.datasetName.disable();
        component.createDatasetForm.controls.owner.disable();

        component.onChangeArchetype(component.ARCHETYPE_LIST[2]);

        expect(component.createDatasetForm.controls.datasetName.enabled).toBe(true);
        expect(component.createDatasetForm.controls.owner.enabled).toBe(true);
        expect(component.createDatasetForm.controls.kind.disabled).toBe(true);
        expect(component.showMonacoEditor).toBe(false);
        expect(component.yamlTemplate).toBe("");
    });

    it("should enable dataset kind for the structured dataset archetype", () => {
        component.createDatasetForm.controls.kind.disable();

        component.onChangeArchetype(component.ARCHETYPE_LIST[0]);

        expect(component.createDatasetForm.controls.kind.enabled).toBe(true);
    });

    it("should disable snapshot initialization in the template for non-structured archetypes", async () => {
        const page = await datasetCreateHarness();
        expect(await page.isYamlSnapshotDisabled()).toBe(false);

        component.archetype = ArchetypeViewType.VERSIONED_FILE;
        fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();

        expect(await page.isYamlSnapshotDisabled()).toBe(true);
    });

    it("should check call createDatasetFromSnapshot()", () => {
        component.showMonacoEditor = true;
        component.yamlTemplate = "test template";
        const createDatasetFromSnapshotSpy = vi
            .spyOn(datasetCreateService, "createDatasetFromSnapshot")
            .mockReturnValue(of(CREATED));

        component.onCreateDataset();

        expect(createDatasetFromSnapshotSpy).toHaveBeenCalledTimes(1);
    });

    it("should check switch checkbox `Initialize from YAML snapshot`)", async () => {
        const page = await datasetCreateHarness();
        expect(await page.isYamlSnapshotChecked()).toBe(false);
        expect(component.showMonacoEditor).toBe(false);

        await page.toggleYamlSnapshot();

        expect(await page.isYamlSnapshotChecked()).toBe(true);
        expect(component.showMonacoEditor).toBe(true);

        await page.toggleYamlSnapshot();

        expect(await page.isYamlSnapshotChecked()).toBe(false);
        expect(component.showMonacoEditor).toBe(false);
    });

    it("should check call uploadFile when file picked)", async () => {
        const page = await datasetCreateHarness();
        await page.toggleYamlSnapshot();

        const mockFile = new File(["test content"], "test.yaml", {
            type: "text/html",
        });
        const fileInput = getElementByDataTestId(fixture, "input-file", HTMLInputElement);
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mockFile);
        fileInput.files = dataTransfer.files;
        const onFileSelectedSpy = vi.spyOn(component, "onFileSelected");
        fileInput.dispatchEvent(new Event("change"));

        expect(onFileSelectedSpy).toHaveBeenCalledTimes(1);
        const call = requireValue(onFileSelectedSpy.mock.results[0]);
        if (call.type !== "return") {
            expect.fail("onFileSelected threw");
        }
        expect(await call.value).toBe("# You can edit this file\ntest content");
    });

    it("should check call uploadFile when file not picked)", async () => {
        const page = await datasetCreateHarness();
        await page.toggleYamlSnapshot();

        const fileInput = getElementByDataTestId(fixture, "input-file", HTMLInputElement);
        const onFileSelectedSpy = vi.spyOn(component, "onFileSelected");
        fileInput.dispatchEvent(new Event("change"));

        expect(onFileSelectedSpy).toHaveBeenCalledTimes(1);
        await vi.waitFor(() => expect(onFileSelectedSpy).toHaveResolvedWith(""));
    });

    it("should keep creating disabled without an owner when no user is logged in", async () => {
        fixture.destroy();
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(null);
        fixture = TestBed.createComponent(DatasetCreateComponent);
        fixture.detectChanges();
        const page = await datasetCreateHarness();

        await page.setDatasetName("my-dataset");

        expect(await page.isCreateDisabled()).toBe(true);
    });

    it("should not create a dataset from an empty snapshot", () => {
        const createDatasetFromSnapshotSpy = stubMethod(datasetCreateService, "createDatasetFromSnapshot");
        component.showMonacoEditor = true;
        component.yamlTemplate = "";

        component.onCreateDataset();

        expect(createDatasetFromSnapshotSpy).not.toHaveBeenCalled();
    });

    ["test.test", "t-test.test", "test.t-test", "t-test.t-test", "my.dataset-1", "a".repeat(100)].forEach(
        (datasetName) => {
            it(`should create a dataset named "${datasetName}"`, async () => {
                const createEmptyDatasetSpy = vi
                    .spyOn(datasetCreateService, "createEmptyDataset")
                    .mockReturnValue(of(CREATED));
                const page = await datasetCreateHarness();

                await page.setDatasetName(datasetName);
                expect(await page.getDatasetNameError()).toBeNull();
                expect(await page.isCreateDisabled()).toBe(false);
                await page.create();

                expect(createEmptyDatasetSpy).toHaveBeenCalledWith({
                    datasetKind: DatasetKind.Root,
                    datasetAlias: datasetName,
                    datasetVisibility: DatasetVisibility.Private,
                });
            });
        },
    );

    [
        { datasetName: "", message: "Dataset name is required" },
        ...["-test.test", "test.-tests", "test.", ".test", "a-", "a--b", "a_b"].map((datasetName) => ({
            datasetName,
            message: "Dataset name may only contain letters, digits, single hyphens and dots between them",
        })),
        { datasetName: "a".repeat(101), message: "Dataset name can't exceed 100 characters" },
    ].forEach(({ datasetName, message }) => {
        it(`should not create a dataset named "${datasetName}"`, async () => {
            const createEmptyDatasetSpy = vi.spyOn(datasetCreateService, "createEmptyDataset");
            const page = await datasetCreateHarness();

            await page.setDatasetName(datasetName);
            expect(await page.getDatasetNameError()).toBe(message);
            expect(await page.isCreateDisabled()).toBe(true);
            await page.create();

            expect(createEmptyDatasetSpy).not.toHaveBeenCalled();
        });
    });
});
