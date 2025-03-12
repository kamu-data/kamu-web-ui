/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { map, Observable } from "rxjs";
import { DatasetCollaborationApi } from "src/app/api/dataset-collaboration.api";
import {
    AccountWithRoleConnection,
    DatasetAccessRole,
    DatasetListCollaboratorsQuery,
    DatasetSearchCollaboratorQuery,
    LookupFilters,
    NameLookupResult,
    SetRoleCollaboratorMutation,
    UnsetRoleCollaboratorMutation,
} from "src/app/api/kamu.graphql.interface";

@Injectable({
    providedIn: "root",
})
export class DatasetCollaborationsService {
    private datasetCollaborationApi = inject(DatasetCollaborationApi);
    private toastrService = inject(ToastrService);

    public listCollaborators(params: {
        datasetId: string;
        page?: number;
        perPage?: number;
    }): Observable<AccountWithRoleConnection> {
        return this.datasetCollaborationApi
            .listCollaborators(params)
            .pipe(
                map(
                    (result: DatasetListCollaboratorsQuery) =>
                        result.datasets.byId?.collaboration.accountRoles as AccountWithRoleConnection,
                ),
            );
    }

    public searchCollaborator(params: {
        query: string;
        filters: LookupFilters;
        page: number;
        perPage: number;
    }): Observable<NameLookupResult[]> {
        return this.datasetCollaborationApi
            .searchCollaborator(params)
            .pipe(
                map((result: DatasetSearchCollaboratorQuery) => result.search.nameLookup.nodes as NameLookupResult[]),
            );
    }

    public setRoleCollaborator(params: {
        datasetId: string;
        accountId: string;
        role: DatasetAccessRole;
    }): Observable<void> {
        return this.datasetCollaborationApi.setRoleCollaborator(params).pipe(
            map((result: SetRoleCollaboratorMutation) => {
                if (result.datasets.byId?.collaboration.setRole.__typename === "SetRoleResultSuccess") {
                    this.toastrService.success(result.datasets.byId.collaboration.setRole.message);
                }
            }),
        );
    }

    public unsetRoleCollaborator(params: { datasetId: string; accountIds: string[] }): Observable<void> {
        return this.datasetCollaborationApi.unsetRoleCollaborator(params).pipe(
            map((result: UnsetRoleCollaboratorMutation) => {
                if (result.datasets.byId?.collaboration.unsetRoles.__typename === "UnsetRoleResultSuccess") {
                    this.toastrService.success(result.datasets.byId.collaboration.unsetRoles.message);
                }
            }),
        );
    }
}
