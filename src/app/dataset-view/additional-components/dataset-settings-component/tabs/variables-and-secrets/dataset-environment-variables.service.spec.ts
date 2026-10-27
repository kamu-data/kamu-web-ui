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

import { requireValue } from "@common/helpers/app.helpers";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { EnvironmentVariablesApi } from "@api/environment-variables.api";
import { ViewDatasetEnvVarConnectionDataFragment } from "@api/kamu.graphql.interface";
import { TEST_ACCOUNT_ID } from "@api/mock/auth.mock";
import { TEST_ACCOUNT_NAME, TEST_DATASET_ID, TEST_DATASET_NAME } from "@api/mock/dataset.mock";
import {
    MOCK_EXPOSED_ENV_VAR_VALUE,
    MOCK_PAGE,
    MOCK_PER_PAGE,
    MOCK_VAR_KEY,
    MOCK_VAR_VALUE,
    mockDeleteEnvVariableMutation,
    mockDeleteEnvVariableMutationError,
    mockExposedEnvVariableValueQuery,
    mockListEnvVariablesQuery,
    mockUpsertEnvVariableMutationCreated,
} from "@api/mock/environment-variables-and-secrets.mock";

import { DatasetEnvironmentVariablesService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-environment-variables.service";

describe("EnvironmentVariablesService", () => {
    let service: DatasetEnvironmentVariablesService;
    let environmentVariablesApi: EnvironmentVariablesApi;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
        service = TestBed.inject(DatasetEnvironmentVariablesService);
        environmentVariablesApi = TestBed.inject(EnvironmentVariablesApi);
        toastrService = TestBed.inject(ToastrService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should fetch list environment variables", () => {
        const listEnvironmentVariablesSpy = vi
            .spyOn(environmentVariablesApi, "listEnvironmentVariables")
            .mockReturnValue(of(mockListEnvVariablesQuery));

        const subscription$ = service
            .listEnvVariables({
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                page: MOCK_PAGE,
                perPage: MOCK_PER_PAGE,
            })
            .subscribe((result: ViewDatasetEnvVarConnectionDataFragment) => {
                expect(result.nodes).toEqual(
                    requireValue(mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables.nodes),
                );
            });

        expect(listEnvironmentVariablesSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("should upsert environment variable with success", () => {
        const saveEnvironmentVariableSpy = vi
            .spyOn(environmentVariablesApi, "upsertEnvironmentVariable")
            .mockReturnValue(of(mockUpsertEnvVariableMutationCreated));
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");

        const subscription$ = service
            .upsertEnvVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                key: MOCK_VAR_KEY,
                value: MOCK_VAR_VALUE,
                isSecret: true,
            })
            .subscribe();

        expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        expect(saveEnvironmentVariableSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("should delete environment variable with success", () => {
        const deleteEnvironmentVariableSpy = vi
            .spyOn(environmentVariablesApi, "deleteEnvironmentVariable")
            .mockReturnValue(of(mockDeleteEnvVariableMutation));
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");

        const subscription$ = service
            .deleteEnvVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                datasetEnvVarKey: MOCK_VAR_KEY,
            })
            .subscribe();

        expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        expect(deleteEnvironmentVariableSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("should delete environment variable with error", () => {
        const deleteEnvironmentVariableSpy = vi
            .spyOn(environmentVariablesApi, "deleteEnvironmentVariable")
            .mockReturnValue(of(mockDeleteEnvVariableMutationError));
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");

        const subscription$ = service
            .deleteEnvVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                datasetEnvVarKey: MOCK_VAR_KEY,
            })
            .subscribe();

        expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        expect(deleteEnvironmentVariableSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("should check exposed variable value", () => {
        const exposedEnvVariableValueSpy = vi
            .spyOn(environmentVariablesApi, "exposedEnvVariableValue")
            .mockReturnValue(of(mockExposedEnvVariableValueQuery));

        const subscription$ = service
            .exposedEnvVariableValue({
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                datasetEnvVarKey: MOCK_VAR_KEY,
            })
            .subscribe((result) => expect(result).toEqual(MOCK_EXPOSED_ENV_VAR_VALUE));

        expect(exposedEnvVariableValueSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });
});
