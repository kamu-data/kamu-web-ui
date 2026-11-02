/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { EnvironmentVariablesApi } from "@api/environment-variables.api";
import { ViewDatasetEnvVarConnectionDataFragment } from "@api/kamu.graphql.interface";
import { TEST_ACCOUNT_ID } from "@api/mock/auth.mock";
import { TEST_ACCOUNT_NAME, TEST_DATASET_ID, TEST_DATASET_NAME } from "@api/mock/dataset.mock";
import {
    MOCK_ENV_VAR_ALREADY_EXISTS_MESSAGE,
    MOCK_ENV_VAR_INVALID_KEY_MESSAGE,
    MOCK_ENV_VAR_TOO_MANY_ENTRIES_MESSAGE,
    MOCK_ENV_VAR_VALUE_TOO_LONG_MESSAGE,
    MOCK_EXPOSED_ENV_VAR_VALUE,
    MOCK_PAGE,
    MOCK_PER_PAGE,
    MOCK_VAR_KEY,
    MOCK_VAR_VALUE,
    mockCreateEnvVariableMutationAlreadyExists,
    mockCreateEnvVariableMutationCreated,
    mockCreateEnvVariableMutationInvalidKey,
    mockCreateEnvVariableMutationTooManyEntries,
    mockDeleteEnvVariableMutation,
    mockDeleteEnvVariableMutationError,
    mockExposedEnvVariableValueQuery,
    mockListEnvVariablesQuery,
    mockUpsertEnvVariableMutationCreated,
    mockUpsertEnvVariableMutationValueTooLong,
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

    const saveParams = {
        accountId: TEST_ACCOUNT_ID,
        datasetId: TEST_DATASET_ID,
        key: MOCK_VAR_KEY,
        value: MOCK_VAR_VALUE,
        isSecret: false,
    };

    it("should create environment variable with success", async () => {
        const createSpy = vi
            .spyOn(environmentVariablesApi, "createEnvironmentVariable")
            .mockReturnValue(of(mockCreateEnvVariableMutationCreated));
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");

        const result = await firstValueFrom(service.createEnvVariable(saveParams));

        expect(result).toEqual({ ok: true });
        expect(createSpy).toHaveBeenCalledWith(saveParams);
        expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
    });

    it("should return a key that is taken as an error of the key field", async () => {
        vi.spyOn(environmentVariablesApi, "createEnvironmentVariable").mockReturnValue(
            of(mockCreateEnvVariableMutationAlreadyExists),
        );
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");

        const result = await firstValueFrom(service.createEnvVariable(saveParams));

        expect(result).toEqual({
            ok: false,
            fieldError: { field: "keyEnvVariable", message: MOCK_ENV_VAR_ALREADY_EXISTS_MESSAGE },
        });
        expect(toastrServiceErrorSpy).not.toHaveBeenCalled();
    });

    it("should return an invalid key as an error of the key field", async () => {
        vi.spyOn(environmentVariablesApi, "createEnvironmentVariable").mockReturnValue(
            of(mockCreateEnvVariableMutationInvalidKey),
        );

        const result = await firstValueFrom(service.createEnvVariable(saveParams));

        expect(result).toEqual({
            ok: false,
            fieldError: { field: "keyEnvVariable", message: MOCK_ENV_VAR_INVALID_KEY_MESSAGE },
        });
    });

    it("should show too many entries as a toast, since it belongs to no field", async () => {
        vi.spyOn(environmentVariablesApi, "createEnvironmentVariable").mockReturnValue(
            of(mockCreateEnvVariableMutationTooManyEntries),
        );
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");

        const result = await firstValueFrom(service.createEnvVariable(saveParams));

        expect(result).toEqual({ ok: false, fieldError: null });
        expect(toastrServiceErrorSpy).toHaveBeenCalledWith(MOCK_ENV_VAR_TOO_MANY_ENTRIES_MESSAGE);
    });

    it("should return a value that is too long as an error of the value field", async () => {
        vi.spyOn(environmentVariablesApi, "upsertEnvironmentVariable").mockReturnValue(
            of(mockUpsertEnvVariableMutationValueTooLong),
        );
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");

        const result = await firstValueFrom(service.upsertEnvVariable(saveParams));

        expect(result).toEqual({
            ok: false,
            fieldError: { field: "value", message: MOCK_ENV_VAR_VALUE_TOO_LONG_MESSAGE },
        });
        expect(toastrServiceSuccessSpy).not.toHaveBeenCalled();
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
