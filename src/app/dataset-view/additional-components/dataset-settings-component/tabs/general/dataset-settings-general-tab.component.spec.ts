/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ApplicationRef } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import type { Mock } from "vitest";

import { ModalService } from "@common/components/modal/modal.service";
import { emitClickOnElementByDataTestId, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { TEST_ACCOUNT_ID } from "@api/mock/auth.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { DatasetSettingsService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-settings.service";
import { DatasetSettingsGeneralTabComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/general/dataset-settings-general-tab.component";
import { DatasetSettingsGeneralTabHarness } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/general/dataset-settings-general-tab.harness";
import { DatasetResetMode } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/general/dataset-settings-general-tab.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

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
        setComponentInput(fixture, "generalTabData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: structuredClone(mockFullPowerDatasetPermissionsFragment),
        });

        datasetSettingsService = TestBed.inject(DatasetSettingsService);
        modalService = TestBed.inject(ModalService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        datasetService = TestBed.inject(DatasetService);

        navigationService = TestBed.inject(NavigationService);
        fixture.detectChanges();
    });

    enum Elements {
        ResetDatasetButton = "reset-dataset-button",
    }

    function generalTabHarness(): Promise<DatasetSettingsGeneralTabHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, DatasetSettingsGeneralTabHarness);
    }

    function answerEveryModal(ok: boolean): Mock<ModalService["error"]> {
        return vi.spyOn(modalService, "error").mockImplementation((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, ok);
            return Promise.resolve("");
        });
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should scroll to the section from the URL fragment once the view is rendered", () => {
        const scrollSpy = vi.spyOn(HTMLElement.prototype, "scrollIntoView").mockImplementation(() => {});

        component.jumpToSection("visibility");
        expect(scrollSpy).not.toHaveBeenCalled();

        fixture.detectChanges();
        TestBed.inject(ApplicationRef).tick();
        expect(scrollSpy).toHaveBeenCalledTimes(1);
        expect(scrollSpy).toHaveBeenCalledWith({ behavior: "smooth" });
    });

    it("should check default state of properties", async () => {
        const tab = await generalTabHarness();

        expect(await tab.isDeleteShown()).toBe(true);
        expect(await tab.isRenameDisabled()).toBe(false);
    });

    function setDatasetPermissions(general: { canDelete?: boolean; canRename?: boolean }): void {
        const datasetPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);
        Object.assign(datasetPermissions.permissions.general, general);
        setComponentInput(fixture, "generalTabData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions,
        });
    }

    it("should check missing canDelete permission", async () => {
        setDatasetPermissions({ canDelete: false });
        const tab = await generalTabHarness();

        expect(await tab.isDeleteShown()).toBe(false);
        expect(await tab.isRenameDisabled()).toBe(false);
    });

    it("should check missing rename permission", async () => {
        fixture.destroy();
        fixture = TestBed.createComponent(DatasetSettingsGeneralTabComponent);
        component = fixture.componentInstance;
        setDatasetPermissions({ canRename: false });
        const tab = await generalTabHarness();

        expect(await tab.isDeleteShown()).toBe(true);
        expect(component.renameDatasetForm.disabled).toEqual(true);
        expect(await tab.isRenameDisabled()).toBe(true);
    });

    ["someName", "my.dataset-1", "a".repeat(100)].forEach((newName) => {
        it(`should rename the dataset to "${newName}"`, async () => {
            const renameDatasetSpy = vi.spyOn(datasetSettingsService, "renameDataset").mockReturnValue(of());
            const tab = await generalTabHarness();

            await tab.setDatasetName(newName);
            expect(await tab.getDatasetNameError()).toBeNull();
            await tab.rename();

            expect(renameDatasetSpy).toHaveBeenCalledWith({
                accountId: TEST_ACCOUNT_ID,
                accountName: component.datasetBasics.owner.accountName,
                datasetId: component.datasetBasics.id,
                newName,
            });
        });
    });

    [
        { newName: "", message: "Dataset name is required" },
        ...["a-", "a--b", "a_b", "-a", "a.", "#illegal#"].map((newName) => ({
            newName,
            message: "Dataset name may only contain letters, digits, single hyphens and dots between them",
        })),
        { newName: "a".repeat(101), message: "Dataset name can't exceed 100 characters" },
    ].forEach(({ newName, message }) => {
        it(`should not rename the dataset to "${newName}"`, async () => {
            const renameDatasetSpy = vi.spyOn(datasetSettingsService, "renameDataset");
            const tab = await generalTabHarness();

            await tab.setDatasetName(newName);
            expect(await tab.getDatasetNameError()).toBe(message);
            expect(await tab.isRenameDisabled()).toBe(true);
            await tab.rename();

            expect(renameDatasetSpy).not.toHaveBeenCalled();
        });
    });

    it("should show the error the server returned for the rename", async () => {
        const tab = await generalTabHarness();

        datasetSettingsService.emitRenameDatasetErrorOccurred("Dataset is already exist.");

        expect(await tab.getRenameServerError()).toBe("Dataset is already exist.");
        expect(await tab.isDatasetNameMarkedInvalid()).toBe(true);
    });

    it("should clear the server error once the name is edited", async () => {
        const tab = await generalTabHarness();
        datasetSettingsService.emitRenameDatasetErrorOccurred("Dataset is already exist.");

        await tab.setDatasetName("another-name");

        expect(await tab.getRenameServerError()).toBeNull();
        expect(await tab.isDatasetNameMarkedInvalid()).toBe(false);
    });

    it("should check delete modal window is shown and sends API call after confirm", async () => {
        const hasOutOfSyncPushRemotesSpy = vi
            .spyOn(datasetService, "hasOutOfSyncPushRemotes")
            .mockReturnValue(of(true));
        const modalServiceSpy = answerEveryModal(true);
        const deleteDatasetSpy = vi.spyOn(datasetSettingsService, "deleteDataset").mockReturnValue(of());
        const tab = await generalTabHarness();

        await tab.deleteDataset();

        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(hasOutOfSyncPushRemotesSpy).toHaveBeenCalledTimes(1);
        expect(deleteDatasetSpy).toHaveBeenCalledWith(component.datasetBasics.owner.id, component.datasetBasics.id);
    });

    it("should check delete modal window is shown and does not send API call after reject", async () => {
        const hasOutOfSyncPushRemotesSpy = vi
            .spyOn(datasetService, "hasOutOfSyncPushRemotes")
            .mockReturnValue(of(false));
        const modalServiceSpy = answerEveryModal(false);
        const deleteDatasetSpy = stubMethod(datasetSettingsService, "deleteDataset");
        const tab = await generalTabHarness();

        await tab.deleteDataset();

        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(hasOutOfSyncPushRemotesSpy).toHaveBeenCalledTimes(1);
        expect(deleteDatasetSpy).not.toHaveBeenCalled();
    });

    it("should check reset modal window is shown and sends API call after confirm for Reset to Seed mode", fakeAsync(() => {
        const modalServiceSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
        const datasetTriggerResetFlowSpy = vi
            .spyOn(datasetFlowsService, "datasetTriggerResetFlow")
            .mockReturnValue(of(true));
        const navigationServiceSpy = vi.spyOn(navigationService, "navigateToDatasetView").mockImplementation(() => {});
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
        const modalServiceSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
        const navigationServiceSpy = vi.spyOn(navigationService, "navigateToDatasetView").mockImplementation(() => {});
        const datasetTriggerResetToMetadataFlowSpy = vi
            .spyOn(datasetFlowsService, "datasetTriggerResetToMetadataFlow")
            .mockReturnValue(of(true));

        emitClickOnElementByDataTestId(fixture, Elements.ResetDatasetButton);
        tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);

        expect(navigationServiceSpy).toHaveBeenCalledTimes(1);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerResetToMetadataFlowSpy).toHaveBeenCalledWith({
            datasetId: component.datasetBasics.id,
        });

        flush();
    }));

    it("should check change dataset visibility", async () => {
        const modalServiceSpy = answerEveryModal(true);
        const setVisibilitySpy = vi.spyOn(datasetSettingsService, "setVisibility").mockImplementation(() => of());
        const tab = await generalTabHarness();

        await tab.changeVisibility();

        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(setVisibilitySpy).toHaveBeenCalledTimes(1);
    });

    it("should navigate to flows after a reset only once the delay passes, and not after destroy", fakeAsync(() => {
        vi.spyOn(modalService, "error").mockImplementation((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        vi.spyOn(datasetFlowsService, "datasetTriggerResetFlow").mockReturnValue(of(true));
        const navigationServiceSpy = vi.spyOn(navigationService, "navigateToDatasetView").mockImplementation(() => {});
        emitClickOnElementByDataTestId(fixture, Elements.ResetDatasetButton);

        tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS - 1);
        expect(navigationServiceSpy).not.toHaveBeenCalled();

        fixture.destroy();
        tick(1);
        expect(navigationServiceSpy).not.toHaveBeenCalled();
        flush();
    }));
});
