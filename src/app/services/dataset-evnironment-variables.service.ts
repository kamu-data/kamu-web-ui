import { inject, Injectable } from "@angular/core";
import { EnvironmentVariablesApi } from "../api/environment-variables.api";
import { map, Observable } from "rxjs";
import {
    DeleteEnvVariableMutation,
    ExposedEnvVariableValueQuery,
    ListEnvVariablesQuery,
    ModifyEnvVariableMutation,
    SaveEnvVariableMutation,
    ViewDatasetEnvVarConnection,
} from "../api/kamu.graphql.interface";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root",
})
export class DatasetEvnironmentVariablesService {
    private environmentVariablesApi = inject(EnvironmentVariablesApi);
    private toastrService = inject(ToastrService);

    public listEnvVariables(params: {
        accountName: string;
        datasetName: string;
        page: number;
        perPage: number;
    }): Observable<ViewDatasetEnvVarConnection> {
        return this.environmentVariablesApi
            .listEnvironmentVariables(params)
            .pipe(
                map(
                    (result: ListEnvVariablesQuery) =>
                        result.datasets.byOwnerAndName?.envVars.listEnvVariables as ViewDatasetEnvVarConnection,
                ),
            );
    }

    public saveEnvVariable(params: {
        accountId: string;
        datasetId: string;
        key: string;
        value: string;
        isSecret: boolean;
    }): Observable<void> {
        return this.environmentVariablesApi.saveEnvironmentVariable(params).pipe(
            map((result: SaveEnvVariableMutation) => {
                if (result.datasets.byId?.envVars.saveEnvVariable.__typename === "SaveDatasetEnvVarResultSuccess") {
                    this.toastrService.success(result.datasets.byId.envVars.saveEnvVariable.message);
                } else {
                    this.toastrService.error(result.datasets.byId?.envVars.saveEnvVariable.message);
                }
            }),
        );
    }

    public modifyEnvVariable(params: {
        accountId: string;
        datasetId: string;
        id: string;
        newValue: string;
        isSecret: boolean;
    }): Observable<void> {
        return this.environmentVariablesApi.modifyEnvironmentVariable(params).pipe(
            map((result: ModifyEnvVariableMutation) => {
                if (result.datasets.byId?.envVars.modifyEnvVariable.__typename === "ModifyDatasetEnvVarResultSuccess") {
                    this.toastrService.success(result.datasets.byId.envVars.modifyEnvVariable.message);
                } else {
                    this.toastrService.error(result.datasets.byId?.envVars.modifyEnvVariable.message);
                }
            }),
        );
    }

    public deleteEnvVariable(params: {
        accountId: string;
        datasetId: string;
        datasetEnvVarId: string;
    }): Observable<void> {
        return this.environmentVariablesApi.deleteEnvironmentVariable(params).pipe(
            map((result: DeleteEnvVariableMutation) => {
                if (result.datasets.byId?.envVars.deleteEnvVariable.__typename === "DeleteDatasetEnvVarResultSuccess") {
                    this.toastrService.success(result.datasets.byId.envVars.deleteEnvVariable.message);
                } else {
                    this.toastrService.error(result.datasets.byId?.envVars.deleteEnvVariable.message);
                }
            }),
        );
    }

    public exposedEnvVariableValue(params: {
        accountName: string;
        datasetName: string;
        datasetEnvVarId: string;
    }): Observable<string> {
        return this.environmentVariablesApi
            .exposedEnvVariableValue(params)
            .pipe(
                map(
                    (result: ExposedEnvVariableValueQuery) =>
                        result.datasets.byOwnerAndName?.envVars.exposedValue ?? "",
                ),
            );
    }
}
