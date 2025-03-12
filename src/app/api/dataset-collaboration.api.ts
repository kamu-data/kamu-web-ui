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
    DatasetSearchCollaboratorGQL,
    DatasetSearchCollaboratorQuery,
    LookupFilters,
    SetRoleCollaboratorGQL,
    SetRoleCollaboratorMutation,
    UnsetRoleCollaboratorGQL,
    UnsetRoleCollaboratorMutation,
} from "./kamu.graphql.interface";
import { first, map, Observable } from "rxjs";
import { ApolloQueryResult } from "@apollo/client";
import { DatasetOperationError } from "../common/values/errors";
import { MutationResult } from "apollo-angular";
import { noCacheFetchPolicy } from "../common/helpers/data.helpers";

@Injectable({ providedIn: "root" })
export class DatasetCollaborationApi {
    private datasetListCollaboratorsGQL = inject(DatasetListCollaboratorsGQL);
    private datasetSearchCollaboratorGQL = inject(DatasetSearchCollaboratorGQL);
    private setRoleCollaboratorGQL = inject(SetRoleCollaboratorGQL);
    private unsetRoleCollaboratorGQL = inject(UnsetRoleCollaboratorGQL);

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
    }): Observable<DatasetSearchCollaboratorQuery> {
        return this.datasetSearchCollaboratorGQL.watch(params).valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<DatasetSearchCollaboratorQuery>) => {
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
                /* istanbul ignore else */
                if (result.data) {
                    return result.data;
                } else {
                    throw new DatasetOperationError(result.errors ?? []);
                }
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
                /* istanbul ignore else */
                if (result.data) {
                    return result.data;
                } else {
                    throw new DatasetOperationError(result.errors ?? []);
                }
            }),
        );
    }
}
