import { MaybeNullOrUndefined } from "./../common/app.types";
import { Injectable } from "@angular/core";
import { EnvironmentVariablesApi } from "../api/environment-variables.api";
import { map, Observable } from "rxjs";
import {
    DeleteEnvVariableMutation,
    ExposedEnvVariableValueQuery,
    ListEnvVariablesQuery,
    ModifyEnvVariableMutation,
    SaveEnvVariableMutation,
    ViewDatasetEnvVar,
    ViewDatasetEnvVarDataFragment,
} from "../api/kamu.graphql.interface";
import { ToastrService } from "ngx-toastr";
import { MaybeNull } from "../common/app.types";

@Injectable({
    providedIn: "root",
})
export class EvnironmentVariablesService {
    constructor(
        private environmentVariablesApi: EnvironmentVariablesApi,

        private toastrService: ToastrService,
    ) {}

    public listEnvVariables(params: {
        accountName: string;
        datasetName: string;
        page: number;
        perPage: number;
    }): Observable<ViewDatasetEnvVarDataFragment[]> {
        return this.environmentVariablesApi
            .listEnvironmentVariables(params)
            .pipe(
                map(
                    (result: ListEnvVariablesQuery) =>
                        result.datasets.byOwnerAndName?.envVars.listEnvVariables
                            .nodes as ViewDatasetEnvVarDataFragment[],
                ),
            );
    }

    public saveEnvVariable(params: {
        datasetId: string;
        key: string;
        value: string;
        isSecret: boolean;
    }): Observable<MaybeNull<ViewDatasetEnvVar>> {
        return this.environmentVariablesApi.saveEnvironmentVariable(params).pipe(
            map((result: SaveEnvVariableMutation) => {
                if (result.datasets.byId?.envVars.saveEnvVariable.__typename === "SaveDatasetEnvVarResultSuccess") {
                    this.toastrService.success(result.datasets.byId.envVars.saveEnvVariable.message);
                    return result.datasets.byId.envVars.saveEnvVariable.envVar as ViewDatasetEnvVar;
                } else {
                    this.toastrService.error(result.datasets.byId?.envVars.saveEnvVariable.message);
                    return null;
                }
            }),
        );
    }

    public modifyEnvVariable(params: {
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

    public deleteEnvVariable(params: { datasetId: string; datasetEnvVarId: string }): Observable<void> {
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
    }): Observable<MaybeNullOrUndefined<string>> {
        return this.environmentVariablesApi
            .exposedEnvVariableValue(params)
            .pipe(map((result: ExposedEnvVariableValueQuery) => result.datasets.byOwnerAndName?.envVars.exposedValue));
    }
}
