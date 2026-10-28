/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { ModalService } from "@common/components/modal/modal.service";
import { emitClickOnElementByDataTestId, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { DatasetSettingsCompactingTabComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.component";
import { DatasetSettingsCompactingTabHarness } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.harness";
import { SliceUnit } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("DatasetSettingsCompactingTabComponent", () => {
    let component: DatasetSettingsCompactingTabComponent;
    let fixture: ComponentFixture<DatasetSettingsCompactingTabComponent>;
    let modalService: ModalService;
    let datasetFlowsService: DatasetFlowsService;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                Apollo,
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
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
            imports: [DatasetSettingsCompactingTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsCompactingTabComponent);
        component = fixture.componentInstance;
        modalService = TestBed.inject(ModalService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        navigationService = TestBed.inject(NavigationService);
        setComponentInput(fixture, "compactingTabData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: structuredClone(mockFullPowerDatasetPermissionsFragment),
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    // Inside fakeAsync a harness flushes every pending timer, so the test of the delay clicks the button directly.
    const RUN_COMPACTION_BUTTON = "run-compaction-btn";

    function compactingTabHarness(): Promise<DatasetSettingsCompactingTabHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, DatasetSettingsCompactingTabHarness);
    }

    function confirmEveryModal(): void {
        vi.spyOn(modalService, "error").mockImplementation((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
    }

    [
        { value: "", message: "is required" },
        { value: "0", message: "must be at least 1" },
        { value: "1.5", message: "must be a whole number" },
    ].forEach(({ value, message }) => {
        it(`should reject the slice size "${value}" and keep compaction disabled`, async () => {
            const tab = await compactingTabHarness();

            await tab.setSliceSize(value);

            expect(await tab.getSliceSizeError()).toBe(`Max slice size ${message}`);
            expect(await tab.isRunCompactionDisabled()).toBe(true);
        });

        it(`should reject the slice records "${value}" and keep compaction disabled`, async () => {
            const tab = await compactingTabHarness();

            await tab.setRecordsCount(value);

            expect(await tab.getRecordsCountError()).toBe(`Max slice records ${message}`);
            expect(await tab.isRunCompactionDisabled()).toBe(true);
        });
    });

    it("should not ask to run compaction while a field is invalid", async () => {
        const modalServiceSpy = vi.spyOn(modalService, "error");
        const tab = await compactingTabHarness();

        await tab.setRecordsCount("0");
        await tab.runCompaction();

        expect(modalServiceSpy).not.toHaveBeenCalled();
    });

    it("should run compaction with the entered slice size and records", async () => {
        stubMethod(navigationService, "navigateToDatasetView");
        const runHardCompactionSpy = vi
            .spyOn(datasetFlowsService, "datasetTriggerCompactionFlow")
            .mockReturnValue(of(false));
        confirmEveryModal();
        const tab = await compactingTabHarness();

        await tab.setSliceSize("1");
        await tab.setSliceUnit(SliceUnit.KB);
        await tab.setRecordsCount("500");

        expect(await tab.getSliceSizeError()).toBeNull();
        expect(await tab.getRecordsCountError()).toBeNull();
        expect(await tab.isRunCompactionDisabled()).toBe(false);
        await tab.runCompaction();

        expect(runHardCompactionSpy).toHaveBeenCalledWith({
            datasetId: mockDatasetBasicsDerivedFragment.id,
            compactionConfigInput: { maxSliceSize: 1024, maxSliceRecords: 500 },
        });
    });

    [
        { unit: SliceUnit.KB, bytes: 1024 },
        { unit: SliceUnit.MB, bytes: 1024 * 1024 },
        { unit: SliceUnit.GB, bytes: 1024 * 1024 * 1024 },
    ].forEach(({ unit, bytes }) => {
        it(`should send a slice size of 1 ${unit} as ${bytes} bytes`, async () => {
            const runHardCompactionSpy = vi
                .spyOn(datasetFlowsService, "datasetTriggerCompactionFlow")
                .mockReturnValue(of(false));
            confirmEveryModal();
            const tab = await compactingTabHarness();

            await tab.setSliceSize("1");
            await tab.setSliceUnit(unit);
            await tab.setRecordsCount("1");
            await tab.runCompaction();

            expect(runHardCompactionSpy).toHaveBeenCalledWith({
                datasetId: mockDatasetBasicsDerivedFragment.id,
                compactionConfigInput: { maxSliceSize: bytes, maxSliceRecords: 1 },
            });
        });
    });

    it("should not run compaction when it is cancelled", async () => {
        vi.spyOn(modalService, "error").mockImplementation((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, false);
            return Promise.resolve("");
        });
        const runHardCompactionSpy = stubMethod(datasetFlowsService, "datasetTriggerCompactionFlow");
        const tab = await compactingTabHarness();

        await tab.runCompaction();

        expect(runHardCompactionSpy).not.toHaveBeenCalled();
    });

    it("should check run hard compacting", fakeAsync(async () => {
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        const runHardCompactionSpy = vi
            .spyOn(datasetFlowsService, "datasetTriggerCompactionFlow")
            .mockReturnValue(of(true));
        const modalServiceSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
        const tab = await compactingTabHarness();
        await tab.runCompaction();

        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(runHardCompactionSpy).toHaveBeenCalledTimes(1);
        tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should navigate to flows after compaction only once the delay passes, and not after destroy", fakeAsync(() => {
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        vi.spyOn(datasetFlowsService, "datasetTriggerCompactionFlow").mockReturnValue(of(true));
        vi.spyOn(modalService, "error").mockImplementation((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        emitClickOnElementByDataTestId(fixture, RUN_COMPACTION_BUTTON);

        tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS - 1);
        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();

        fixture.destroy();
        tick(1);
        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();
        flush();
    }));
});
