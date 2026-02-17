/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { EnvironmentVariablesApi } from "../../../../../api/environment-variables.api";
import { ViewDatasetEnvVar, ViewDatasetEnvVarConnection } from "../../../../../api/kamu.graphql.interface";
import {
    TEST_ACCOUNT_ID,
    TEST_ACCOUNT_NAME,
    TEST_DATASET_ID,
    TEST_DATASET_NAME,
} from "../../../../../api/mock/dataset.mock";
import {
    MOCK_ENV_VAR_ID,
    MOCK_IS_SECRET,
    MOCK_KEY,
    MOCK_PAGE,
    MOCK_PER_PAGE,
    MOCK_VALUE,
    mockDeleteEnvVariableMutation,
    mockDeleteEnvVariableMutationError,
    mockExposedEnvVariableValueQuery,
    mockListEnvVariablesQuery,
    mockUpsertEnvVariableMutationCreated,
} from "../../../../../api/mock/environment-variables-and-secrets.mock";
import { DatasetEvnironmentVariablesService } from "./dataset-evnironment-variables.service";

describe("EvnironmentVariablesService", () => {
    let service: DatasetEvnironmentVariablesService;
    let environmentVariablesApi: EnvironmentVariablesApi;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
        service = TestBed.inject(DatasetEvnironmentVariablesService);
        environmentVariablesApi = TestBed.inject(EnvironmentVariablesApi);
        toastrService = TestBed.inject(ToastrService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should fetch list environment variables", () => {
        const listEnvironmentVariablesSpy = spyOn(environmentVariablesApi, "listEnvironmentVariables").and.returnValue(
            of(mockListEnvVariablesQuery),
        );

        const subscription$ = service
            .listEnvVariables({
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                page: MOCK_PAGE,
                perPage: MOCK_PER_PAGE,
            })
            .subscribe((result: ViewDatasetEnvVarConnection) => {
                expect(result.nodes).toEqual(
                    mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables
                        .nodes as ViewDatasetEnvVar[],
                );
            });

        expect(listEnvironmentVariablesSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("should upsert environment variable with success", () => {
        const saveEnvironmentVariableSpy = spyOn(environmentVariablesApi, "upsertEnvironmentVariable").and.returnValue(
            of(mockUpsertEnvVariableMutationCreated),
        );
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");

        const subscription$ = service
            .upsertEnvVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                key: MOCK_KEY,
                value: MOCK_VALUE,
                isSecret: MOCK_IS_SECRET,
            })
            .subscribe();

        expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        expect(saveEnvironmentVariableSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("should delete environment variable with success", () => {
        const deleteEnvironmentVariableSpy = spyOn(
            environmentVariablesApi,
            "deleteEnvironmentVariable",
        ).and.returnValue(of(mockDeleteEnvVariableMutation));
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");

        const subscription$ = service
            .deleteEnvVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                datasetEnvVarId: MOCK_ENV_VAR_ID,
            })
            .subscribe();

        expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        expect(deleteEnvironmentVariableSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("should delete environment variable with error", () => {
        const deleteEnvironmentVariableSpy = spyOn(
            environmentVariablesApi,
            "deleteEnvironmentVariable",
        ).and.returnValue(of(mockDeleteEnvVariableMutationError));
        const toastrServiceErrorSpy = spyOn(toastrService, "error");

        const subscription$ = service
            .deleteEnvVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                datasetEnvVarId: MOCK_ENV_VAR_ID,
            })
            .subscribe();

        expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        expect(deleteEnvironmentVariableSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("should check exposed variable value", () => {
        const exposedEnvVariableValueSpy = spyOn(environmentVariablesApi, "exposedEnvVariableValue").and.returnValue(
            of(mockExposedEnvVariableValueQuery),
        );

        const subscription$ = service
            .exposedEnvVariableValue({
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                datasetEnvVarId: MOCK_ENV_VAR_ID,
            })
            .subscribe((result) =>
                expect(result).toEqual(
                    mockExposedEnvVariableValueQuery.datasets.byOwnerAndName?.envVars.exposedValue as string,
                ),
            );

        expect(exposedEnvVariableValueSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });
});
