import { first, map, Observable } from "rxjs";
import {
    DeleteEnvVariableGQL,
    DeleteEnvVariableMutation,
    ExposedEnvVariableValueGQL,
    ExposedEnvVariableValueQuery,
    ListEnvVariablesGQL,
    ListEnvVariablesQuery,
    UpsertEnvVariableGQL,
    UpsertEnvVariableMutation,
} from "./kamu.graphql.interface";
import { inject, Injectable } from "@angular/core";
import { noCacheFetchPolicy } from "../common/data.helpers";
import { ApolloQueryResult } from "@apollo/client";
import { DatasetOperationError } from "../common/errors";
import { MutationResult } from "apollo-angular";
import { updateCacheHelper } from "../apollo-cache.helper";

@Injectable({
    providedIn: "root",
})
export class EnvironmentVariablesApi {
    private listEnvVariablesGQL = inject(ListEnvVariablesGQL);
    private upsertEnvVariableGQL = inject(UpsertEnvVariableGQL);
    private deleteEnvVariableGQL = inject(DeleteEnvVariableGQL);
    private exposedEnvVariableValueGQL = inject(ExposedEnvVariableValueGQL);

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

    public upsertEnvironmentVariable(params: {
        accountId: string;
        datasetId: string;
        key: string;
        value: string;
        isSecret: boolean;
    }): Observable<UpsertEnvVariableMutation> {
        return this.upsertEnvVariableGQL
            .mutate(
                { datasetId: params.datasetId, key: params.key, value: params.value, isSecret: params.isSecret },
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
                map((result: MutationResult<UpsertEnvVariableMutation>) => {
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
                    update: (cache, { data }) => {
                        const id = cache.identify({
                            __typename: "ViewDatasetEnvVar",
                            id: (data as DeleteEnvVariableMutation).datasets.byId?.envVars.deleteEnvVariable.envVarId,
                        });
                        cache.evict({ id });
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
