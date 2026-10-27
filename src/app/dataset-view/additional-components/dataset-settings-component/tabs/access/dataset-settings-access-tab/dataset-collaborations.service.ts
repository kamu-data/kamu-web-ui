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
import { DatasetCollaborationApi } from "@api/dataset-collaboration.api";
import {
    AccountFragment,
    AccountWithRoleConnectionDataFragment,
    DatasetAccessRole,
    DatasetListCollaboratorsQuery,
    DatasetUserRoleQuery,
    LookupFilters,
    SearchCollaboratorQuery,
    SetRoleCollaboratorMutation,
    UnsetRoleCollaboratorMutation,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

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
    }): Observable<AccountWithRoleConnectionDataFragment> {
        return this.datasetCollaborationApi
            .listCollaborators(params)
            .pipe(
                map((result: DatasetListCollaboratorsQuery) =>
                    requireValue(result.datasets.byId?.collaboration.accountRoles),
                ),
            );
    }

    public searchCollaborator(params: {
        query: string;
        filters: LookupFilters;
        page: number;
        perPage: number;
    }): Observable<AccountFragment[]> {
        return this.datasetCollaborationApi
            .searchCollaborator(params)
            .pipe(map((result: SearchCollaboratorQuery) => result.search.nameLookup.nodes));
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

    public getRoleByDatasetId(datasetId: string): Observable<MaybeNull<DatasetAccessRole>> {
        return this.datasetCollaborationApi.getDatasetUserRole(datasetId).pipe(
            map((result: DatasetUserRoleQuery) => {
                return result.datasets.byId?.role ?? null;
            }),
        );
    }
}
