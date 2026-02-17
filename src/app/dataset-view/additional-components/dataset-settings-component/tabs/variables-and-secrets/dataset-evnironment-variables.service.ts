/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable } from "rxjs";

import { ToastrService } from "ngx-toastr";

import { EnvironmentVariablesApi } from "../../../../../api/environment-variables.api";
import {
    DeleteEnvVariableMutation,
    ExposedEnvVariableValueQuery,
    ListEnvVariablesQuery,
    UpsertEnvVariableMutation,
    ViewDatasetEnvVarConnection,
} from "../../../../../api/kamu.graphql.interface";

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

    public upsertEnvVariable(params: {
        accountId: string;
        datasetId: string;
        key: string;
        value: string;
        isSecret: boolean;
    }): Observable<void> {
        return this.environmentVariablesApi.upsertEnvironmentVariable(params).pipe(
            map((result: UpsertEnvVariableMutation) => {
                if (
                    result.datasets.byId?.envVars.upsertEnvVariable.__typename === "UpsertDatasetEnvVarResultCreated" ||
                    result.datasets.byId?.envVars.upsertEnvVariable.__typename === "UpsertDatasetEnvVarResultUpdated" ||
                    result.datasets.byId?.envVars.upsertEnvVariable.__typename === "UpsertDatasetEnvVarUpToDate"
                ) {
                    this.toastrService.success(result.datasets.byId.envVars.upsertEnvVariable?.message);
                } else {
                    this.toastrService.error("Environment variable is not found");
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
