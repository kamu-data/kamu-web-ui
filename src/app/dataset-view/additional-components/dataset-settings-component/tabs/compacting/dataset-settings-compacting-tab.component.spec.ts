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

import { ModalService } from "@common/components/modal/modal.service";
import { emitClickOnElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { DatasetSettingsCompactingTabComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.component";
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

    it("should check run hard compacting", fakeAsync(() => {
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
        emitClickOnElementByDataTestId(fixture, "run-compaction-btn");

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
        emitClickOnElementByDataTestId(fixture, "run-compaction-btn");

        tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS - 1);
        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();

        fixture.destroy();
        tick(1);
        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();
        flush();
    }));
});
