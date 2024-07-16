import { TEST_DATASET_ID } from "src/app/api/mock/dataset.mock";
import { TestBed } from "@angular/core/testing";
import { EnvironmentVariablesApi } from "./environment-variables.api";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule, ApolloTestingController } from "apollo-angular/testing";
import {
    DeleteEnvVariableDocument,
    DeleteEnvVariableMutation,
    ExposedEnvVariableValueDocument,
    ExposedEnvVariableValueQuery,
    ListEnvVariablesDocument,
    ListEnvVariablesQuery,
    ModifyEnvVariableDocument,
    ModifyEnvVariableMutation,
    SaveEnvVariableDocument,
    SaveEnvVariableMutation,
} from "./kamu.graphql.interface";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "./mock/dataset.mock";
import {
    MOCK_ENV_VAR_ID,
    MOCK_IS_SECRET,
    MOCK_KEY,
    MOCK_NEW_VALUE,
    MOCK_PAGE,
    MOCK_PER_PAGE,
    MOCK_VALUE,
    mockDeleteEnvVariableMutation,
    mockExposedEnvVariableValueQuery,
    mockListEnvVariablesQuery,
    mockModifyEnvVariableMutation,
    mockSaveEnvVariableMutation,
} from "./mock/environment-variables-and-secrets.mock";
import { TEST_ACCOUNT_ID } from "./mock/auth.mock";

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

    it("should check save environment variables", () => {
        service
            .saveEnvironmentVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                key: MOCK_KEY,
                value: MOCK_VALUE,
                isSecret: MOCK_IS_SECRET,
            })
            .subscribe((result: SaveEnvVariableMutation) => {
                if (result.datasets.byId?.envVars.saveEnvVariable.__typename === "SaveDatasetEnvVarResultSuccess") {
                    expect(result.datasets.byId?.envVars.saveEnvVariable.message).toEqual(
                        mockSaveEnvVariableMutation.datasets.byId?.envVars.saveEnvVariable.message as string,
                    );
                }
            });

        const op = controller.expectOne(SaveEnvVariableDocument);
        expect(op.operation.variables.accountId).toEqual(TEST_ACCOUNT_ID);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.key).toEqual(MOCK_KEY);
        expect(op.operation.variables.value).toEqual(MOCK_VALUE);
        expect(op.operation.variables.isSecret).toEqual(MOCK_IS_SECRET);

        op.flush({
            data: mockSaveEnvVariableMutation,
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

                expect(result.datasets.byOwnerAndName?.envVars.listEnvVariables.nodes).toEqual(
                    mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables.nodes,
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

    it("should check modify environment variable", () => {
        service
            .modifyEnvironmentVariable({
                datasetId: TEST_DATASET_ID,
                id: MOCK_ENV_VAR_ID,
                newValue: MOCK_NEW_VALUE,
                isSecret: MOCK_IS_SECRET,
            })
            .subscribe((result: ModifyEnvVariableMutation) => {
                expect(result.datasets.byId?.envVars.modifyEnvVariable.envVarId).toEqual(
                    result.datasets.byId?.envVars.modifyEnvVariable.envVarId as string,
                );
                expect(result.datasets.byId?.envVars.modifyEnvVariable.message).toEqual(
                    result.datasets.byId?.envVars.modifyEnvVariable.message,
                );
            });

        const op = controller.expectOne(ModifyEnvVariableDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.id).toEqual(MOCK_ENV_VAR_ID);
        expect(op.operation.variables.newValue).toEqual(MOCK_NEW_VALUE);
        expect(op.operation.variables.isSecret).toEqual(MOCK_IS_SECRET);

        op.flush({
            data: mockModifyEnvVariableMutation,
        });
    });

    it("should check delete environment variable", () => {
        service
            .deleteEnvironmentVariable({
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
