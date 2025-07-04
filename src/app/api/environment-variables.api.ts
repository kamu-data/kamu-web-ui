/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

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
import { noCacheFetchPolicy } from "../common/helpers/data.helpers";
import { ApolloQueryResult } from "@apollo/client";
import { MutationResult } from "apollo-angular";
import { updateCacheHelper } from "../common/helpers/apollo-cache.helper";

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
        return this.listEnvVariablesGQL.watch({ ...params }, noCacheFetchPolicy).valueChanges.pipe(
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
                    return result.data as UpsertEnvVariableMutation;
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
                    return result.data as DeleteEnvVariableMutation;
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
