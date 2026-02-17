/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr, ToastrService } from "ngx-toastr";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    DatasetFlowType,
    FlowTriggerBreakingChangeRule,
    FlowTriggerRuleInput,
    FlowTriggerStopPolicyInput,
    GetDatasetFlowTriggerQuery,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import {
    mockGetDatasetFlowTriggerCronQuery,
    mockPauseDatasetFlowTriggerSuccess,
    mockSetDatasetFlowTriggerError,
    mockSetDatasetFlowTriggerSuccess,
} from "src/app/api/mock/dataset-flow.mock";
import AppValues from "src/app/common/values/app.values";
import { mockDatasetInfo } from "src/app/search/mock.data";

import { NavigationService } from "../../../../services/navigation.service";
import { DatasetFlowTriggerService } from "./dataset-flow-trigger.service";

describe("DatasetFlowTriggerService", () => {
    let service: DatasetFlowTriggerService;
    let datasetFlowApi: DatasetFlowApi;
    let toastService: ToastrService;
    let navigationService: NavigationService;

    const MOCK_DATASET_ID = "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8";

    const MOCK_TRIGGER_RULE_INPUT: FlowTriggerRuleInput = {
        reactive: {
            forNewData: {
                buffering: {
                    minRecordsToAwait: 100,
                    maxBatchingInterval: {
                        every: 10,
                        unit: TimeUnit.Minutes,
                    },
                },
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
        },
    };

    const MOCK_TRIGGER_STOP_POLICY_INPUT: FlowTriggerStopPolicyInput = {
        never: {
            dummy: true,
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(DatasetFlowTriggerService);
        datasetFlowApi = TestBed.inject(DatasetFlowApi);
        toastService = TestBed.inject(ToastrService);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check fetchDatasetFlowTrigger method", () => {
        spyOn(datasetFlowApi, "getDatasetFlowTrigger").and.returnValue(of(mockGetDatasetFlowTriggerCronQuery));
        const subscription$ = service
            .fetchDatasetFlowTrigger(MOCK_DATASET_ID, DatasetFlowType.Ingest)
            .subscribe((res: GetDatasetFlowTriggerQuery) => {
                expect(res.datasets.byId?.flows.triggers.byType?.schedule?.__typename).toEqual(
                    "Cron5ComponentExpression",
                );
                expect(res.datasets.byId?.flows.triggers.byType?.paused).toEqual(
                    mockGetDatasetFlowTriggerCronQuery.datasets.byId?.flows.triggers.byType?.paused,
                );
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check setDatasetFlowTrigger with success", fakeAsync(() => {
        spyOn(datasetFlowApi, "setDatasetFlowTrigger").and.returnValue(of(mockSetDatasetFlowTriggerSuccess));
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        const subscription$ = service
            .setDatasetFlowTrigger({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                triggerRuleInput: MOCK_TRIGGER_RULE_INPUT,
                triggerStopPolicyInput: MOCK_TRIGGER_STOP_POLICY_INPUT,
                datasetInfo: mockDatasetInfo,
            })
            .subscribe(() => {
                tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);
                expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
                flush();
            });

        expect(subscription$.closed).toBeTrue();
    }));

    it("should check setDatasetTriggers with error", fakeAsync(() => {
        spyOn(datasetFlowApi, "setDatasetFlowTrigger").and.returnValue(of(mockSetDatasetFlowTriggerError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service
            .setDatasetFlowTrigger({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                triggerRuleInput: MOCK_TRIGGER_RULE_INPUT,
                triggerStopPolicyInput: MOCK_TRIGGER_STOP_POLICY_INPUT,
                datasetInfo: mockDatasetInfo,
            })
            .subscribe(() => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
            });

        expect(subscription$.closed).toBeTrue();
    }));

    it("should check pauseDatasetFlowTrigger with success", () => {
        spyOn(datasetFlowApi, "pauseDatasetFlowTrigger").and.returnValue(of(mockPauseDatasetFlowTriggerSuccess));
        const toastrServiceSuccessSpy = spyOn(toastService, "success");

        const subscription$ = service
            .pauseDatasetFlowTrigger({
                datasetId: MOCK_DATASET_ID,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
            })
            .subscribe(() => {
                expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
            });

        expect(subscription$.closed).toBeTrue();
    });
});
