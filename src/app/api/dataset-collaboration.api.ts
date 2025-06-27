/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import {
    DatasetAccessRole,
    DatasetListCollaboratorsGQL,
    DatasetListCollaboratorsQuery,
    SearchCollaboratorGQL,
    SearchCollaboratorQuery,
    LookupFilters,
    SetRoleCollaboratorGQL,
    SetRoleCollaboratorMutation,
    UnsetRoleCollaboratorGQL,
    UnsetRoleCollaboratorMutation,
    DatasetUserRoleGQL,
    DatasetUserRoleQuery,
} from "./kamu.graphql.interface";
import { first, map, Observable } from "rxjs";
import { ApolloQueryResult } from "@apollo/client";
import { MutationResult } from "apollo-angular";
import { noCacheFetchPolicy } from "../common/helpers/data.helpers";

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
        return this.datasetListCollaboratorsGQL.watch(params, noCacheFetchPolicy).valueChanges.pipe(
            first(),

            map((result: ApolloQueryResult<DatasetListCollaboratorsQuery>) => {
                return result.data;
            }),
        );
    }

    public searchCollaborator(params: {
        query: string;
        filters: LookupFilters;
        page: number;
        perPage: number;
    }): Observable<SearchCollaboratorQuery> {
        return this.searchCollaboratorGQL.watch(params, noCacheFetchPolicy).valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<SearchCollaboratorQuery>) => {
                return result.data;
            }),
        );
    }

    public setRoleCollaborator(params: {
        datasetId: string;
        accountId: string;
        role: DatasetAccessRole;
    }): Observable<SetRoleCollaboratorMutation> {
        return this.setRoleCollaboratorGQL.mutate(params).pipe(
            first(),
            map((result: MutationResult<SetRoleCollaboratorMutation>) => {
                return result.data as SetRoleCollaboratorMutation;
            }),
        );
    }

    public unsetRoleCollaborator(params: {
        datasetId: string;
        accountIds: string[];
    }): Observable<UnsetRoleCollaboratorMutation> {
        return this.unsetRoleCollaboratorGQL.mutate({ ...params }).pipe(
            first(),
            map((result: MutationResult<UnsetRoleCollaboratorMutation>) => {
                return result.data as UnsetRoleCollaboratorMutation;
            }),
        );
    }

    public getDatasetUserRole(datasetId: string): Observable<DatasetUserRoleQuery> {
        return this.datasetUserRoleGQL.watch({ datasetId }, noCacheFetchPolicy).valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<DatasetUserRoleQuery>) => {
                return result.data;
            }),
        );
    }
}
