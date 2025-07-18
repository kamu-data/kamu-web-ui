/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { of } from "rxjs";
import { getInputElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { DatasetCreateComponent } from "./dataset-create.component";
import { DatasetCreateService } from "./dataset-create.service";
import { SharedTestModule } from "../common/modules/shared-test.module";
import { LoggedUserService } from "../auth/logged-user.service";
import { mockAccountDetails } from "../api/mock/auth.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ApolloTestingModule } from "apollo-angular/testing";

describe("DatasetCreateComponent", () => {
    let component: DatasetCreateComponent;
    let fixture: ComponentFixture<DatasetCreateComponent>;
    let datasetCreateService: DatasetCreateService;
    let loggedUserService: LoggedUserService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, HttpClientTestingModule, SharedTestModule, DatasetCreateComponent],
        })
            .overrideComponent(DatasetCreateComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        registerMatSvgIcons();

        loggedUserService = TestBed.inject(LoggedUserService);
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);

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
        const element = getInputElementByDataTestId(fixture, "create-error-message");
        expect(element.textContent).toEqual(errorMessage);
        flush();
    }));

    it("should check getter isFormValid()", () => {
        component.yamlTemplate = "testYaml";
        fixture.detectChanges();
        expect(component.isFormValid).toBeTrue();
    });

    it("should check call createDatasetFromForm()", () => {
        const createDatasetFromFormSpy = spyOn(datasetCreateService, "createEmptyDataset").and.returnValue(of());

        component.onCreateDataset();

        expect(createDatasetFromFormSpy).toHaveBeenCalledTimes(1);
    });

    it("should check call createDatasetFromSnapshot()", () => {
        component.showMonacoEditor = true;
        component.yamlTemplate = "test template";
        const createDatasetFromSnapshotSpy = spyOn(datasetCreateService, "createDatasetFromSnapshot").and.returnValue(
            of(),
        );

        component.onCreateDataset();

        expect(createDatasetFromSnapshotSpy).toHaveBeenCalledTimes(1);
    });

    it("should check switch checkbox `Initialize from YAML snapshot`)", () => {
        const checkboxInput = getInputElementByDataTestId(fixture, "show-monaco-editor");
        expect(checkboxInput.checked).toBeFalse();
        expect(component.showMonacoEditor).toBeFalse();

        checkboxInput.click();

        expect(checkboxInput.checked).toBeTrue();
        expect(component.showMonacoEditor).toBeTrue();

        checkboxInput.click();

        expect(checkboxInput.checked).toBeFalse();
        expect(component.showMonacoEditor).toBeFalse();
    });

    it("should check call uploadFile when file picked)", async () => {
        const checkboxInput = getInputElementByDataTestId(fixture, "show-monaco-editor");

        checkboxInput.click();
        fixture.detectChanges();

        const mockFile = new File(["test content"], "test.yaml", {
            type: "text/html",
        });
        const mockEvt = { target: { files: [mockFile] } };
        try {
            const result = await component.onFileSelected(mockEvt as unknown as Event);
            expect(result).toBe("# You can edit this file\ntest content");
        } catch (error) {
            fail(error);
        }
    });

    it("should check call uploadFile when file not picked)", async () => {
        const checkboxInput = getInputElementByDataTestId(fixture, "show-monaco-editor");

        checkboxInput.click();
        fixture.detectChanges();

        const mockEvt = { target: { files: [] } };
        try {
            const result = await component.onFileSelected(mockEvt as unknown as Event);
            expect(result).toBe("");
        } catch (error) {
            fail(error);
        }
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
