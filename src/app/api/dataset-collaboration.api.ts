/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { first, map, Observable } from "rxjs";

import { ApolloLink, ObservableQuery } from "@apollo/client/core";
import { onlyCompleteData } from "apollo-angular";

import { noCacheFetchPolicy } from "@common/helpers/data.helpers";
import {
    DatasetAccessRole,
    DatasetListCollaboratorsGQL,
    DatasetListCollaboratorsQuery,
    DatasetUserRoleGQL,
    DatasetUserRoleQuery,
    LookupFilters,
    SearchCollaboratorGQL,
    SearchCollaboratorQuery,
    SetRoleCollaboratorGQL,
    SetRoleCollaboratorMutation,
    UnsetRoleCollaboratorGQL,
    UnsetRoleCollaboratorMutation,
} from "@api/kamu.graphql.interface";

@Injectable({ providedIn: "root" })
export class DatasetCollaborationApi {
    private datasetListCollaboratorsGQL = inject(DatasetListCollaboratorsGQL);
    private searchCollaboratorGQL = inject(SearchCollaboratorGQL);
    private setRoleCollaboratorGQL = inject(SetRoleCollaboratorGQL);
    private unsetRoleCollaboratorGQL = inject(UnsetRoleCollaboratorGQL);
    private datasetUserRoleGQL = inject(DatasetUserRoleGQL);

    public listCollaborators(params: {
        datasetId: string;
        page?: number;
        perPage?: number;
    }): Observable<DatasetListCollaboratorsQuery> {
        return this.datasetListCollaboratorsGQL.watch({ variables: params, ...noCacheFetchPolicy }).valueChanges.pipe(
            onlyCompleteData(),
            first(),

            map((result: ObservableQuery.Result<DatasetListCollaboratorsQuery>) => {
                return result.data as DatasetListCollaboratorsQuery;
            }),
        );
    }

    public searchCollaborator(params: {
        query: string;
        filters: LookupFilters;
        page: number;
        perPage: number;
    }): Observable<SearchCollaboratorQuery> {
        return this.searchCollaboratorGQL.watch({ variables: params, ...noCacheFetchPolicy }).valueChanges.pipe(
            onlyCompleteData(),
            first(),
            map((result: ObservableQuery.Result<SearchCollaboratorQuery>) => {
                return result.data as SearchCollaboratorQuery;
            }),
        );
    }

    public setRoleCollaborator(params: {
        datasetId: string;
        accountId: string;
        role: DatasetAccessRole;
    }): Observable<SetRoleCollaboratorMutation> {
        return this.setRoleCollaboratorGQL.mutate({ variables: params }).pipe(
            first(),
            map((result: ApolloLink.Result<SetRoleCollaboratorMutation>) => {
                return result.data as SetRoleCollaboratorMutation;
            }),
        );
    }

    public unsetRoleCollaborator(params: {
        datasetId: string;
        accountIds: string[];
    }): Observable<UnsetRoleCollaboratorMutation> {
        return this.unsetRoleCollaboratorGQL.mutate({ variables: { ...params } }).pipe(
            first(),
            map((result: ApolloLink.Result<UnsetRoleCollaboratorMutation>) => {
                return result.data as UnsetRoleCollaboratorMutation;
            }),
        );
    }

    public getDatasetUserRole(datasetId: string): Observable<DatasetUserRoleQuery> {
        return this.datasetUserRoleGQL.watch({ variables: { datasetId }, ...noCacheFetchPolicy }).valueChanges.pipe(
            onlyCompleteData(),
            first(),
            map((result: ObservableQuery.Result<DatasetUserRoleQuery>) => {
                return result.data as DatasetUserRoleQuery;
            }),
        );
    }
}
