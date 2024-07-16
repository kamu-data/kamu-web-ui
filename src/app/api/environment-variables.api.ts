import { first, map, Observable } from "rxjs";
import {
    DeleteEnvVariableGQL,
    DeleteEnvVariableMutation,
    ExposedEnvVariableValueGQL,
    ExposedEnvVariableValueQuery,
    ListEnvVariablesGQL,
    ListEnvVariablesQuery,
    ModifyEnvVariableGQL,
    ModifyEnvVariableMutation,
    SaveEnvVariableGQL,
    SaveEnvVariableMutation,
} from "./kamu.graphql.interface";
import { Injectable } from "@angular/core";
import { noCacheFetchPolicy, updateCacheHelper } from "../common/data.helpers";
import { ApolloQueryResult } from "@apollo/client";
import { DatasetOperationError } from "../common/errors";
import { MutationResult } from "apollo-angular";

@Injectable({
    providedIn: "root",
})
export class EnvironmentVariablesApi {
    constructor(
        private listEnvVariablesGQL: ListEnvVariablesGQL,
        private saveEnvVariableGQL: SaveEnvVariableGQL,
        private modifyEnvVariableGQL: ModifyEnvVariableGQL,
        private deleteEnvVariableGQL: DeleteEnvVariableGQL,
        private exposedEnvVariableValueGQL: ExposedEnvVariableValueGQL,
    ) {}

    public listEnvironmentVariables(params: {
        accountName: string;
        datasetName: string;
        page: number;
        perPage: number;
    }): Observable<ListEnvVariablesQuery> {
        return this.listEnvVariablesGQL.watch({ ...params }).valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<ListEnvVariablesQuery>) => {
                return result.data;
            }),
        );
    }

    public saveEnvironmentVariable(params: {
        accountId: string;
        datasetId: string;
        key: string;
        value: string;
        isSecret: boolean;
    }): Observable<SaveEnvVariableMutation> {
        return this.saveEnvVariableGQL
            .mutate(
                { ...params },
                {
                    update: (cache) => {
                        updateCacheHelper(cache, {
                            accountId: params.accountId,
                            datasetId: params.datasetId,
                            fieldNames: ["envVars"],
                        });
                    },
                },
            )
            .pipe(
                first(),
                map((result: MutationResult<SaveEnvVariableMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public modifyEnvironmentVariable(params: {
        accountId: string;
        datasetId: string;
        id: string;
        newValue: string;
        isSecret: boolean;
    }): Observable<ModifyEnvVariableMutation> {
        return this.modifyEnvVariableGQL
            .mutate(
                { ...params },
                {
                    update: (cache) => {
                        updateCacheHelper(cache, {
                            accountId: params.accountId,
                            datasetId: params.datasetId,
                            fieldNames: ["envVars"],
                        });
                    },
                },
            )
            .pipe(
                first(),
                map((result: MutationResult<ModifyEnvVariableMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public deleteEnvironmentVariable(params: {
        accountId: string;
        datasetId: string;
        datasetEnvVarId: string;
    }): Observable<DeleteEnvVariableMutation> {
        return this.deleteEnvVariableGQL
            .mutate(
                { ...params },
                {
                    update: (cache) => {
                        updateCacheHelper(cache, {
                            accountId: params.accountId,
                            datasetId: params.datasetId,
                            fieldNames: ["envVars"],
                        });
                    },
                },
            )
            .pipe(
                first(),
                map((result: MutationResult<DeleteEnvVariableMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public exposedEnvVariableValue(params: {
        accountName: string;
        datasetName: string;
        datasetEnvVarId: string;
    }): Observable<ExposedEnvVariableValueQuery> {
        return this.exposedEnvVariableValueGQL.watch({ ...params }, noCacheFetchPolicy).valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<ExposedEnvVariableValueQuery>) => {
                return result.data;
            }),
        );
    }
}
