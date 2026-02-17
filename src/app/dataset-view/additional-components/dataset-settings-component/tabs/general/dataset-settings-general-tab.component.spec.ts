/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { DatasetSettingsService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-settings.service";
import { DatasetSettingsGeneralTabComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/general/dataset-settings-general-tab.component";
import { DatasetResetMode } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/general/dataset-settings-general-tab.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { ModalService } from "@common/components/modal/modal.service";
import {
    checkVisible,
    dispatchInputEvent,
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    getInputElementByDataTestId,
} from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { TEST_ACCOUNT_ID } from "@api/mock/auth.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

describe("DatasetSettingsGeneralTabComponent", () => {
    let component: DatasetSettingsGeneralTabComponent;
    let fixture: ComponentFixture<DatasetSettingsGeneralTabComponent>;
    let datasetSettingsService: DatasetSettingsService;
    let modalService: ModalService;
    let datasetFlowsService: DatasetFlowsService;
    let navigationService: NavigationService;
    let datasetService: DatasetService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DatasetSettingsGeneralTabComponent],
            providers: [
                Apollo,
                provideToastr(),
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
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
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
        const datasetTriggerResetFlowSpy = spyOn(datasetFlowsService, "datasetTriggerResetFlow").and.returnValue(
            of(true),
        );
        const navigationServiceSpy = spyOn(navigationService, "navigateToDatasetView");
        emitClickOnElementByDataTestId(fixture, Elements.ResetDatasetButton);
        tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);

        expect(navigationServiceSpy).toHaveBeenCalledTimes(1);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerResetFlowSpy).toHaveBeenCalledWith({
            datasetId: component.datasetBasics.id,
            resetConfigInput: {
                mode: {
                    toSeed: {},
                },
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
        const datasetTriggerResetToMetadataFlowSpy = spyOn(
            datasetFlowsService,
            "datasetTriggerResetToMetadataFlow",
        ).and.returnValue(of(true));

        emitClickOnElementByDataTestId(fixture, Elements.ResetDatasetButton);
        tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);

        expect(navigationServiceSpy).toHaveBeenCalledTimes(1);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerResetToMetadataFlowSpy).toHaveBeenCalledWith({
            datasetId: component.datasetBasics.id,
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
