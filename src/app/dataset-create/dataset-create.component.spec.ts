/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";

import {
    getElementByDataTestId,
    getInputElementByDataTestId,
    registerMatSvgIcons,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { DatasetVisibility } from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetCreateComponent } from "src/app/dataset-create/dataset-create.component";
import { DatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { ArchetypeViewType } from "src/app/dataset-create/dataset-create.types";

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

    it("should check error message is exist", fakeAsync(() => {
        const errorMessage = "testMessage";
        datasetCreateService.emitErrorMessageChanged(errorMessage);
        tick();
        fixture.detectChanges();
        const element = getElementByDataTestId(fixture, "create-error-message");
        expect(element.textContent).toEqual(errorMessage);
        flush();
    }));

    it("should check getter isFormValid()", () => {
        component.yamlTemplate = "testYaml";
        fixture.detectChanges();
        expect(component.isFormValid).toBe(true);
    });

    it("should check call createDatasetFromForm()", () => {
        const createDatasetFromFormSpy = vi.spyOn(datasetCreateService, "createEmptyDataset").mockReturnValue(of());

        component.onCreateDataset();

        expect(createDatasetFromFormSpy).toHaveBeenCalledTimes(1);
    });

    it("should create a collection for the collection archetype", () => {
        component.archetype = ArchetypeViewType.COLLECTION;
        component.createDatasetForm.patchValue({
            datasetName: "my-collection",
            visibility: DatasetVisibility.Public,
        });
        const createCollectionSpy = vi.spyOn(datasetCreateService, "createCollection").mockReturnValue(of());

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
        const createVersionedFileSpy = vi.spyOn(datasetCreateService, "createVersionedFile").mockReturnValue(of());

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

    it("should disable snapshot initialization in the template for non-structured archetypes", fakeAsync(() => {
        tick();
        component.archetype = ArchetypeViewType.VERSIONED_FILE;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const checkboxInput = getInputElementByDataTestId(fixture, "show-monaco-editor");
        expect(checkboxInput.disabled).toBe(true);
        flush();
    }));

    it("should check call createDatasetFromSnapshot()", () => {
        component.showMonacoEditor = true;
        component.yamlTemplate = "test template";
        const createDatasetFromSnapshotSpy = vi
            .spyOn(datasetCreateService, "createDatasetFromSnapshot")
            .mockReturnValue(of());

        component.onCreateDataset();

        expect(createDatasetFromSnapshotSpy).toHaveBeenCalledTimes(1);
    });

    it("should check switch checkbox `Initialize from YAML snapshot`)", () => {
        const checkboxInput = getInputElementByDataTestId(fixture, "show-monaco-editor");
        expect(checkboxInput.checked).toBe(false);
        expect(component.showMonacoEditor).toBe(false);

        checkboxInput.click();

        expect(checkboxInput.checked).toBe(true);
        expect(component.showMonacoEditor).toBe(true);

        checkboxInput.click();

        expect(checkboxInput.checked).toBe(false);
        expect(component.showMonacoEditor).toBe(false);
    });

    it("should check call uploadFile when file picked)", async () => {
        const checkboxInput = getInputElementByDataTestId(fixture, "show-monaco-editor");

        checkboxInput.click();
        fixture.detectChanges();

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
        await vi.waitFor(() => expect(onFileSelectedSpy).toHaveResolvedWith("# You can edit this file\ntest content"));
    });

    it("should check call uploadFile when file not picked)", async () => {
        const checkboxInput = getInputElementByDataTestId(fixture, "show-monaco-editor");

        checkboxInput.click();
        fixture.detectChanges();

        const fileInput = getElementByDataTestId(fixture, "input-file", HTMLInputElement);
        const onFileSelectedSpy = vi.spyOn(component, "onFileSelected");
        fileInput.dispatchEvent(new Event("change"));

        expect(onFileSelectedSpy).toHaveBeenCalledTimes(1);
        await vi.waitFor(() => expect(onFileSelectedSpy).toHaveResolvedWith(""));
    });

    [
        { datasetName: "test.test", valid: true },
        { datasetName: "t-test.test", valid: true },
        { datasetName: "test.t-test", valid: true },
        { datasetName: "t-test.t-test", valid: true },
        { datasetName: "-test.test", valid: false },
        { datasetName: "test.-tests", valid: false },
        { datasetName: "test.", valid: false },
        { datasetName: ".test", valid: false },
        { datasetName: "", valid: false },
    ].forEach((item: { datasetName: string; valid: boolean }) => {
        it(`should check valid form with datasetName=${item.datasetName}`, () => {
            component.createDatasetForm.patchValue({
                datasetName: item.datasetName,
            });
            fixture.detectChanges();
            expect(component.createDatasetForm.valid).toBe(item.valid);
        });
    });
});
