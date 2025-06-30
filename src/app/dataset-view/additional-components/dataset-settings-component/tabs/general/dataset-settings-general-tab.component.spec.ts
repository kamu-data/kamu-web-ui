/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NavigationService } from "./../../../../../services/navigation.service";
import { DatasetCompactionService } from "./../../services/dataset-compaction.service";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { DatasetSettingsGeneralTabComponent } from "./dataset-settings-general-tab.component";
import { DatasetSettingsService } from "../../services/dataset-settings.service";
import { ModalService } from "../../../../../common/components/modal/modal.service";
import { ApolloModule } from "apollo-angular";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { ApolloTestingModule } from "apollo-angular/testing";
import {
    mockDatasetBasicsDerivedFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "../../../../../search/mock.data";
import { of } from "rxjs";
import {
    checkVisible,
    dispatchInputEvent,
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    getInputElementByDataTestId,
} from "../../../../../common/helpers/base-test.helpers.spec";
import { TEST_ACCOUNT_ID } from "src/app/api/mock/auth.mock";
import { ToastrModule } from "ngx-toastr";
import { MatRadioModule } from "@angular/material/radio";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { DatasetResetMode } from "./dataset-settings-general-tab.types";
import AppValues from "src/app/common/values/app.values";
import { DatasetFlowsService } from "../../../flows-component/services/dataset-flows.service";
import { DatasetService } from "../../../../dataset.service";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DatasetVisibilityModule } from "src/app/common/components/dataset-visibility/dataset-visibility.module";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";
import { ActivatedRoute } from "@angular/router";
import { FormValidationErrorsModule } from "src/app/common/directives/form-validation-errors.module";

describe("DatasetSettingsGeneralTabComponent", () => {
    let component: DatasetSettingsGeneralTabComponent;
    let fixture: ComponentFixture<DatasetSettingsGeneralTabComponent>;
    let datasetSettingsService: DatasetSettingsService;
    let modalService: ModalService;
    let datasetCompactionService: DatasetCompactionService;
    let navigationService: NavigationService;
    let flowsService: DatasetFlowsService;
    let datasetService: DatasetService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetSettingsGeneralTabComponent, TooltipIconComponent],
            imports: [
                ReactiveFormsModule,
                HttpClientTestingModule,
                MatDividerModule,
                MatIconModule,
                ApolloModule,
                ApolloTestingModule,
                ToastrModule.forRoot(),
                MatRadioModule,
                MatIconModule,
                NgbTooltipModule,
                MatCheckboxModule,
                FormsModule,
                DatasetVisibilityModule,
                FormValidationErrorsModule,
            ],
            providers: [
                FormBuilder,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        fragment: of(""),
                        snapshot: {
                            queryParamMap: {
                                get: () => null,
                            },
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return mockDatasetBasicsDerivedFragment.owner.accountName;
                                        case "datasetName":
                                            return mockDatasetBasicsDerivedFragment.name;
                                    }
                                },
                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsGeneralTabComponent);
        component = fixture.componentInstance;
        component.generalTabData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: structuredClone(mockFullPowerDatasetPermissionsFragment),
        };

        datasetSettingsService = TestBed.inject(DatasetSettingsService);
        modalService = TestBed.inject(ModalService);
        datasetCompactionService = TestBed.inject(DatasetCompactionService);
        flowsService = TestBed.inject(DatasetFlowsService);
        datasetService = TestBed.inject(DatasetService);

        navigationService = TestBed.inject(NavigationService);
        fixture.detectChanges();
    });

    enum Elements {
        RenameDatasetButton = "rename-dataset-button",
        RenameDatasetInput = "rename-dataset-input",

        RenameDatasetErrorName = "rename-dataset-error-name",
        RenameDatasetErrorCustom = "rename-dataset-error-custom",

        DeleteDatasetButton = "delete-dataset-button",

        ResetDatasetButton = "reset-dataset-button",
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check default state of properties", () => {
        expect(component.isAllowedToDeleteDataset).toEqual(true);
        expect(component.renameDatasetForm.disabled).toEqual(false);
    });

    it("should check missing canDelete permission", () => {
        component.datasetPermissions.permissions.general.canDelete = false;
        fixture.detectChanges();

        expect(component.isAllowedToDeleteDataset).toEqual(false);
        expect(component.renameDatasetForm.disabled).toEqual(false);
    });

    it("should check missing rename permission", () => {
        component.datasetPermissions.permissions.general.canRename = false;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.isAllowedToDeleteDataset).toEqual(true);
        expect(component.renameDatasetForm.disabled).toEqual(true);
    });

    it("should check rename dataset", () => {
        const renameDatasetSpy = spyOn(datasetSettingsService, "renameDataset").and.returnValue(of());

        dispatchInputEvent(fixture, Elements.RenameDatasetInput, "someName");
        emitClickOnElementByDataTestId(fixture, Elements.RenameDatasetButton);

        expect(renameDatasetSpy).toHaveBeenCalledOnceWith({
            accountId: TEST_ACCOUNT_ID,
            accountName: component.datasetBasics.owner.accountName,
            datasetId: component.datasetBasics.id,
            newName: "someName",
        });
    });

    it("should check init renameError", fakeAsync(() => {
        const errorMessage = "Dataset is already exist.";
        datasetSettingsService.emitRenameDatasetErrorOccurred(errorMessage);
        fixture.detectChanges();

        tick();

        const elemInput = getInputElementByDataTestId(fixture, "rename-dataset-input");
        expect(elemInput).toHaveClass("error-border-color");

        checkVisible(fixture, Elements.RenameDatasetErrorCustom, true);

        flush();
    }));

    it("should check rename validation required", () => {
        const renameDatasetSpy = spyOn(component, "renameDataset").and.stub();

        dispatchInputEvent(fixture, Elements.RenameDatasetInput, "");
        emitClickOnElementByDataTestId(fixture, Elements.RenameDatasetButton);

        fixture.detectChanges();

        expect(renameDatasetSpy).not.toHaveBeenCalled();

        const errorElement = findElementByDataTestId(fixture, "rename-dataset-error");
        expect(errorElement?.textContent?.trim()).toEqual("Dataset name is required");
    });

    it("should check rename validation pattern", () => {
        const renameDatasetSpy = spyOn(component, "renameDataset").and.stub();

        dispatchInputEvent(fixture, Elements.RenameDatasetInput, "#illegal#");
        emitClickOnElementByDataTestId(fixture, Elements.RenameDatasetButton);

        fixture.detectChanges();

        expect(renameDatasetSpy).not.toHaveBeenCalled();

        const errorElement = findElementByDataTestId(fixture, "rename-dataset-error");
        expect(errorElement?.textContent?.trim()).toEqual("Dataset name format is wrong");
    });

    it("should check renameError is empty after keyup", fakeAsync(() => {
        const errorMessage = "Dataset is already exist.";
        datasetSettingsService.emitRenameDatasetErrorOccurred(errorMessage);

        const renameDatasetInput = getInputElementByDataTestId(fixture, Elements.RenameDatasetInput);
        renameDatasetInput.dispatchEvent(new Event("keyup"));
        fixture.detectChanges();

        tick();

        expect(renameDatasetInput).not.toHaveClass("error-border-color");
        flush();
    }));

    it("should check delete modal window is shown and sends API call after confirm", fakeAsync(() => {
        const hasOutOfSyncPushRemotesSpy = spyOn(datasetService, "hasOutOfSyncPushRemotes").and.returnValue(of(true));
        const modalServiceSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const deleteDatasetSpy = spyOn(datasetSettingsService, "deleteDataset").and.returnValue(of());

        emitClickOnElementByDataTestId(fixture, Elements.DeleteDatasetButton);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(hasOutOfSyncPushRemotesSpy).toHaveBeenCalledTimes(1);
        fixture.detectChanges();

        tick();

        expect(deleteDatasetSpy).toHaveBeenCalledOnceWith(component.datasetBasics.owner.id, component.datasetBasics.id);

        flush();
    }));

    it("should check delete modal window is shown and does not send API call after reject", fakeAsync(() => {
        const hasOutOfSyncPushRemotesSpy = spyOn(datasetService, "hasOutOfSyncPushRemotes").and.returnValue(of(false));
        const modalServiceSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, false);
            return Promise.resolve("");
        });
        const deleteDatasetSpy = spyOn(datasetSettingsService, "deleteDataset").and.stub();

        emitClickOnElementByDataTestId(fixture, Elements.DeleteDatasetButton);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(hasOutOfSyncPushRemotesSpy).toHaveBeenCalledTimes(1);
        fixture.detectChanges();

        tick();

        expect(deleteDatasetSpy).not.toHaveBeenCalled();

        flush();
    }));

    it("should check reset modal window is shown and sends API call after confirm for Reset to Seed mode", fakeAsync(() => {
        const modalServiceSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const resetToSeedSpy = spyOn(datasetCompactionService, "resetToSeed").and.returnValue(of(true));
        const navigationServiceSpy = spyOn(navigationService, "navigateToDatasetView");
        emitClickOnElementByDataTestId(fixture, Elements.ResetDatasetButton);
        tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);

        expect(navigationServiceSpy).toHaveBeenCalledTimes(1);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(resetToSeedSpy).toHaveBeenCalledWith({
            accountId: component.datasetBasics.owner.id,
            datasetId: component.datasetBasics.id,
            resetArgs: {
                mode: {
                    toSeed: {},
                },
                recursive: component.recursiveControl.value,
            },
        });
        flush();
    }));

    it("should check reset modal window is shown and sends API call after confirm for Flatten metadata mode", fakeAsync(() => {
        component.resetDatasetForm.patchValue({ mode: DatasetResetMode.RESET_METADATA_ONLY });
        const modalServiceSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const navigationServiceSpy = spyOn(navigationService, "navigateToDatasetView");
        const datasetTriggerCompactionFlowSpy = spyOn(flowsService, "datasetTriggerCompactionFlow").and.returnValue(
            of(true),
        );

        emitClickOnElementByDataTestId(fixture, Elements.ResetDatasetButton);
        tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);

        expect(navigationServiceSpy).toHaveBeenCalledTimes(1);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerCompactionFlowSpy).toHaveBeenCalledWith({
            datasetId: component.datasetBasics.id,
            compactionConfigInput: {
                metadataOnly: {
                    recursive: component.recursiveControl.value,
                },
            },
        });

        flush();
    }));

    it("should check change dataset visibility", () => {
        const modalServiceSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const setVisibilitySpy = spyOn(datasetSettingsService, "setVisibility").and.callFake(() => of());

        component.changeVisibilityDataset();
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(setVisibilitySpy).toHaveBeenCalledTimes(1);
    });
});
