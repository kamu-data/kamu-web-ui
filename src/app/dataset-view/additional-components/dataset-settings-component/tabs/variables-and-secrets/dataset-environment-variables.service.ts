/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable } from "rxjs";

import { ToastrService } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { EnvironmentVariablesApi } from "@api/environment-variables.api";
import {
    CreateDatasetEnvVarResultAlreadyExists,
    CreateEnvVariableMutation,
    DatasetEnvVarEmptyValue,
    DatasetEnvVarInvalidKey,
    DatasetEnvVarTooManyEntries,
    DatasetEnvVarValueTooLong,
    DeleteEnvVariableMutation,
    ExposedEnvVariableValueQuery,
    ListEnvVariablesQuery,
    UpsertEnvVariableMutation,
    ViewDatasetEnvVarConnectionDataFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

/** A rejection the backend ties to one field of the variable form. */
export interface EnvVarFieldError {
    field: "keyEnvVariable" | "value";
    message: string;
}

export type EnvVarMutationResult = { ok: true } | { ok: false; fieldError: MaybeNull<EnvVarFieldError> };

/** Every result of a create or upsert that the backend returns instead of the variable. */
type EnvVarRejection = Pick<
    | CreateDatasetEnvVarResultAlreadyExists
    | DatasetEnvVarInvalidKey
    | DatasetEnvVarEmptyValue
    | DatasetEnvVarValueTooLong
    | DatasetEnvVarTooManyEntries,
    "__typename" | "message"
>;

function envVarFieldError(result: EnvVarRejection): MaybeNull<EnvVarFieldError> {
    switch (result.__typename) {
        case "CreateDatasetEnvVarResultAlreadyExists":
        case "DatasetEnvVarInvalidKey":
            return { field: "keyEnvVariable", message: result.message };
        case "DatasetEnvVarEmptyValue":
        case "DatasetEnvVarValueTooLong":
            return { field: "value", message: result.message };
        case "DatasetEnvVarTooManyEntries":
            return null;
    }
}

@Injectable({
    providedIn: "root",
})
export class DatasetEnvironmentVariablesService {
    private environmentVariablesApi = inject(EnvironmentVariablesApi);
    private toastrService = inject(ToastrService);

    public listEnvVariables(params: {
        accountName: string;
        datasetName: string;
        page: number;
        perPage: number;
    }): Observable<ViewDatasetEnvVarConnectionDataFragment> {
        return this.environmentVariablesApi
            .listEnvironmentVariables(params)
            .pipe(
                map(
                    (result: ListEnvVariablesQuery) =>
                        requireValue(result.datasets.byOwnerAndName, "Dataset not found").envVars.listEnvVariables,
                ),
            );
    }

    /** Adds a variable; a key the dataset already has is rejected, not overwritten. */
    public createEnvVariable(params: {
        accountId: string;
        datasetId: string;
        key: string;
        value: string;
        isSecret: boolean;
    }): Observable<EnvVarMutationResult> {
        return this.environmentVariablesApi.createEnvironmentVariable(params).pipe(
            map((data: CreateEnvVariableMutation): EnvVarMutationResult => {
                const result = requireValue(data.datasets.byId, "Dataset not found").envVars.createEnvVariable;
                if (result.__typename === "CreateDatasetEnvVarResultCreated") {
                    this.toastrService.success(result.message);
                    return { ok: true };
                }
                return this.rejected(result);
            }),
        );
    }

    public upsertEnvVariable(params: {
        accountId: string;
        datasetId: string;
        key: string;
        value: string;
        isSecret: boolean;
    }): Observable<EnvVarMutationResult> {
        return this.environmentVariablesApi.upsertEnvironmentVariable(params).pipe(
            map((data: UpsertEnvVariableMutation): EnvVarMutationResult => {
                const result = requireValue(data.datasets.byId, "Dataset not found").envVars.upsertEnvVariable;
                switch (result.__typename) {
                    case "UpsertDatasetEnvVarResultCreated":
                    case "UpsertDatasetEnvVarResultUpdated":
                    case "UpsertDatasetEnvVarUpToDate":
                        this.toastrService.success(result.message);
                        return { ok: true };
                    default:
                        return this.rejected(result);
                }
            }),
        );
    }

    public deleteEnvVariable(params: {
        accountId: string;
        datasetId: string;
        datasetEnvVarKey: string;
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

    /** A rejection the form shows on a field, or a toast for one that belongs to no field. */
    private rejected(result: EnvVarRejection): EnvVarMutationResult {
        const fieldError = envVarFieldError(result);
        if (!fieldError) {
            this.toastrService.error(result.message);
        }
        return { ok: false, fieldError };
    }

    public exposedEnvVariableValue(params: {
        accountName: string;
        datasetName: string;
        datasetEnvVarKey: string;
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
