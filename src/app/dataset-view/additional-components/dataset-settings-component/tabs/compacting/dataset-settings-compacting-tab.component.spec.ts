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
import { ModalService } from "src/app/common/components/modal/modal.service";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import AppValues from "src/app/common/values/app.values";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetFlowsService } from "../../../flows-component/services/dataset-flows.service";
import { DatasetSettingsCompactingTabComponent } from "./dataset-settings-compacting-tab.component";

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
        component.compactingTabData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: structuredClone(mockFullPowerDatasetPermissionsFragment),
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check run hard compacting", fakeAsync(() => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        const runHardCompactionSpy = spyOn(datasetFlowsService, "datasetTriggerCompactionFlow").and.returnValue(
            of(true),
        );
        const modalServiceSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
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
});
