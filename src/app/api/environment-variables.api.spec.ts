/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { TEST_DATASET_ID } from "src/app/api/mock/dataset.mock";

import { EnvironmentVariablesApi } from "./environment-variables.api";
import {
    DeleteEnvVariableDocument,
    DeleteEnvVariableMutation,
    ExposedEnvVariableValueDocument,
    ExposedEnvVariableValueQuery,
    ListEnvVariablesDocument,
    ListEnvVariablesQuery,
    UpsertEnvVariableDocument,
    UpsertEnvVariableMutation,
} from "./kamu.graphql.interface";
import { TEST_ACCOUNT_ID } from "./mock/auth.mock";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "./mock/dataset.mock";
import {
    MOCK_ENV_VAR_ID,
    MOCK_IS_SECRET,
    MOCK_KEY,
    MOCK_PAGE,
    MOCK_PER_PAGE,
    MOCK_VALUE,
    mockDeleteEnvVariableMutation,
    mockExposedEnvVariableValueQuery,
    mockListEnvVariablesQuery,
    mockUpsertEnvVariableMutationCreated,
    mockUpsertEnvVariableMutationUpdated,
    mockUpsertEnvVariableMutationUpToDate,
} from "./mock/environment-variables-and-secrets.mock";

describe("EnvironmentVariablesApi", () => {
    let service: EnvironmentVariablesApi;
    let controller: ApolloTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(EnvironmentVariablesApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check upsert environment variable with 'Created' message ", () => {
        service
            .upsertEnvironmentVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                key: MOCK_KEY,
                value: MOCK_VALUE,
                isSecret: MOCK_IS_SECRET,
            })
            .subscribe((result: UpsertEnvVariableMutation) => {
                if (result.datasets.byId?.envVars.upsertEnvVariable.__typename === "UpsertDatasetEnvVarResultCreated") {
                    expect(result.datasets.byId?.envVars.upsertEnvVariable.message).toEqual(
                        mockUpsertEnvVariableMutationCreated.datasets.byId?.envVars.upsertEnvVariable.message as string,
                    );
                }
            });

        const op = controller.expectOne(UpsertEnvVariableDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.key).toEqual(MOCK_KEY);
        expect(op.operation.variables.value).toEqual(MOCK_VALUE);
        expect(op.operation.variables.isSecret).toEqual(MOCK_IS_SECRET);

        op.flush({
            data: mockUpsertEnvVariableMutationCreated,
        });
    });

    it("should check upsert environment variable with 'Updated' message ", () => {
        service
            .upsertEnvironmentVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                key: MOCK_KEY,
                value: MOCK_VALUE,
                isSecret: MOCK_IS_SECRET,
            })
            .subscribe((result: UpsertEnvVariableMutation) => {
                if (result.datasets.byId?.envVars.upsertEnvVariable.__typename === "UpsertDatasetEnvVarResultUpdated") {
                    expect(result.datasets.byId?.envVars.upsertEnvVariable.message).toEqual(
                        mockUpsertEnvVariableMutationUpdated.datasets.byId?.envVars.upsertEnvVariable.message as string,
                    );
                }
            });

        const op = controller.expectOne(UpsertEnvVariableDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.key).toEqual(MOCK_KEY);
        expect(op.operation.variables.value).toEqual(MOCK_VALUE);
        expect(op.operation.variables.isSecret).toEqual(MOCK_IS_SECRET);

        op.flush({
            data: mockUpsertEnvVariableMutationUpdated,
        });
    });

    it("should check upsert environment variable with 'Up to date' message ", () => {
        service
            .upsertEnvironmentVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                key: MOCK_KEY,
                value: MOCK_VALUE,
                isSecret: MOCK_IS_SECRET,
            })
            .subscribe((result: UpsertEnvVariableMutation) => {
                if (result.datasets.byId?.envVars.upsertEnvVariable.__typename === "UpsertDatasetEnvVarResultUpdated") {
                    expect(result.datasets.byId?.envVars.upsertEnvVariable.message).toEqual(
                        mockUpsertEnvVariableMutationCreated.datasets.byId?.envVars.upsertEnvVariable.message as string,
                    );
                }
            });

        const op = controller.expectOne(UpsertEnvVariableDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.key).toEqual(MOCK_KEY);
        expect(op.operation.variables.value).toEqual(MOCK_VALUE);
        expect(op.operation.variables.isSecret).toEqual(MOCK_IS_SECRET);

        op.flush({
            data: mockUpsertEnvVariableMutationUpToDate,
        });
    });

    it("should check list environment variable", () => {
        service
            .listEnvironmentVariables({
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                page: MOCK_PAGE,
                perPage: MOCK_PER_PAGE,
            })
            .subscribe((result: ListEnvVariablesQuery) => {
                expect(result.datasets.byOwnerAndName?.envVars.listEnvVariables.totalCount).toEqual(
                    mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables.totalCount,
                );
            });

        const op = controller.expectOne(ListEnvVariablesDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_ACCOUNT_NAME);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);
        expect(op.operation.variables.perPage).toEqual(MOCK_PER_PAGE);
        expect(op.operation.variables.page).toEqual(MOCK_PAGE);

        op.flush({
            data: mockListEnvVariablesQuery,
        });
    });

    it("should check delete environment variable", () => {
        service
            .deleteEnvironmentVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                datasetEnvVarId: MOCK_ENV_VAR_ID,
            })
            .subscribe((result: DeleteEnvVariableMutation) => {
                expect(result.datasets.byId?.envVars.deleteEnvVariable.envVarId).toEqual(
                    mockDeleteEnvVariableMutation.datasets.byId?.envVars.deleteEnvVariable.envVarId,
                );
                expect(result.datasets.byId?.envVars.deleteEnvVariable.message).toEqual(
                    mockDeleteEnvVariableMutation.datasets.byId?.envVars.deleteEnvVariable.message,
                );
            });

        const op = controller.expectOne(DeleteEnvVariableDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.datasetEnvVarId).toEqual(MOCK_ENV_VAR_ID);

        op.flush({
            data: mockDeleteEnvVariableMutation,
        });
    });

    it("should check expose variable value", () => {
        service
            .exposedEnvVariableValue({
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                datasetEnvVarId: MOCK_ENV_VAR_ID,
            })
            .subscribe((result: ExposedEnvVariableValueQuery) => {
                expect(result.datasets.byOwnerAndName?.envVars.exposedValue).toEqual(
                    mockExposedEnvVariableValueQuery.datasets.byOwnerAndName?.envVars.exposedValue,
                );
            });

        const op = controller.expectOne(ExposedEnvVariableValueDocument);
        expect(op.operation.variables.accountName).toEqual(TEST_ACCOUNT_NAME);
        expect(op.operation.variables.datasetName).toEqual(TEST_DATASET_NAME);
        expect(op.operation.variables.datasetEnvVarId).toEqual(MOCK_ENV_VAR_ID);

        op.flush({
            data: mockExposedEnvVariableValueQuery,
        });
    });
});
