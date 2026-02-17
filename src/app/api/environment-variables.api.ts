/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

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
} from "@api/kamu.graphql.interface";
import { ApolloLink, ObservableQuery } from "@apollo/client/core";
import { updateCacheHelper } from "@common/helpers/apollo-cache.helper";
import { noCacheFetchPolicy } from "@common/helpers/data.helpers";
import { onlyCompleteData } from "apollo-angular";

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
        return this.listEnvVariablesGQL.watch({ variables: { ...params }, ...noCacheFetchPolicy }).valueChanges.pipe(
            onlyCompleteData(),
            first(),
            map((result: ObservableQuery.Result<ListEnvVariablesQuery>) => {
                return result.data as ListEnvVariablesQuery;
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
            .mutate({
                variables: {
                    datasetId: params.datasetId,
                    key: params.key,
                    value: params.value,
                    isSecret: params.isSecret,
                },
                update: (cache) => {
                    updateCacheHelper(cache, {
                        accountId: params.accountId,
                        datasetId: params.datasetId,
                        fieldNames: ["envVars"],
                    });
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<UpsertEnvVariableMutation>) => {
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
            .mutate({
                variables: { ...params },
                update: (cache, { data }) => {
                    const id = cache.identify({
                        __typename: "ViewDatasetEnvVar",
                        id: (data as DeleteEnvVariableMutation).datasets.byId?.envVars.deleteEnvVariable.envVarId,
                    });
                    cache.evict({ id });
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<DeleteEnvVariableMutation>) => {
                    return result.data as DeleteEnvVariableMutation;
                }),
            );
    }

    public exposedEnvVariableValue(params: {
        accountName: string;
        datasetName: string;
        datasetEnvVarId: string;
    }): Observable<ExposedEnvVariableValueQuery> {
        return this.exposedEnvVariableValueGQL
            .watch({ variables: { ...params }, ...noCacheFetchPolicy })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<ExposedEnvVariableValueQuery>) => {
                    return result.data as ExposedEnvVariableValueQuery;
                }),
            );
    }
}
