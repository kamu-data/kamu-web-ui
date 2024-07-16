import { TestBed } from "@angular/core/testing";
import { EvnironmentVariablesService } from "./evnironment-variables.service";
import { Apollo } from "apollo-angular";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { EnvironmentVariablesApi } from "../api/environment-variables.api";
import {
    MOCK_ENV_VAR_ID,
    MOCK_IS_SECRET,
    MOCK_KEY,
    MOCK_NEW_VALUE,
    MOCK_PAGE,
    MOCK_PER_PAGE,
    MOCK_VALUE,
    mockDeleteEnvVariableMutation,
    mockDeleteEnvVariableMutationError,
    mockExposedEnvVariableValueQuery,
    mockListEnvVariablesQuery,
    mockModifyEnvVariableMutation,
    mockModifyEnvVariableMutationError,
    mockSaveEnvVariableMutation,
    mockSaveEnvVariableMutationError,
} from "../api/mock/environment-variables-and-secrets.mock";
import { of } from "rxjs";
import { TEST_ACCOUNT_ID, TEST_ACCOUNT_NAME, TEST_DATASET_ID, TEST_DATASET_NAME } from "../api/mock/dataset.mock";
import { ViewDatasetEnvVar, ViewDatasetEnvVarConnection } from "../api/kamu.graphql.interface";

describe("EvnironmentVariablesService", () => {
    let service: EvnironmentVariablesService;
    let environmentVariablesApi: EnvironmentVariablesApi;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ToastrModule.forRoot()],
        });
        service = TestBed.inject(EvnironmentVariablesService);
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

    it("should save environment variable with success", () => {
        const saveEnvironmentVariableSpy = spyOn(environmentVariablesApi, "saveEnvironmentVariable").and.returnValue(
            of(mockSaveEnvVariableMutation),
        );
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");

        const subscription$ = service
            .saveEnvVariable({
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

    it("should save environment variable with error", () => {
        const saveEnvironmentVariableSpy = spyOn(environmentVariablesApi, "saveEnvironmentVariable").and.returnValue(
            of(mockSaveEnvVariableMutationError),
        );
        const toastrServiceErrorSpy = spyOn(toastrService, "error");

        const subscription$ = service
            .saveEnvVariable({
                accountId: TEST_ACCOUNT_ID,
                datasetId: TEST_DATASET_ID,
                key: MOCK_KEY,
                value: MOCK_VALUE,
                isSecret: MOCK_IS_SECRET,
            })
            .subscribe();

        expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        expect(saveEnvironmentVariableSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("should modify environment variable with success", () => {
        const modifyEnvironmentVariableSpy = spyOn(
            environmentVariablesApi,
            "modifyEnvironmentVariable",
        ).and.returnValue(of(mockModifyEnvVariableMutation));
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");

        const subscription$ = service
            .modifyEnvVariable({
                datasetId: TEST_DATASET_ID,
                id: MOCK_ENV_VAR_ID,
                newValue: MOCK_NEW_VALUE,
                isSecret: MOCK_IS_SECRET,
            })
            .subscribe();

        expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        expect(modifyEnvironmentVariableSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("should modify environment variable with error", () => {
        const modifyEnvironmentVariableSpy = spyOn(
            environmentVariablesApi,
            "modifyEnvironmentVariable",
        ).and.returnValue(of(mockModifyEnvVariableMutationError));
        const toastrServiceErrorSpy = spyOn(toastrService, "error");

        const subscription$ = service
            .modifyEnvVariable({
                datasetId: TEST_DATASET_ID,
                id: MOCK_ENV_VAR_ID,
                newValue: MOCK_NEW_VALUE,
                isSecret: MOCK_IS_SECRET,
            })
            .subscribe();

        expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        expect(modifyEnvironmentVariableSpy).toHaveBeenCalledTimes(1);
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
