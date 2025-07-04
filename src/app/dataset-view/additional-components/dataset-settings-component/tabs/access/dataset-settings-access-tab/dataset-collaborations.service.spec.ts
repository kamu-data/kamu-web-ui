/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { DatasetCollaborationsService } from "./dataset-collaborations.service";
import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";
import { DatasetCollaborationApi } from "src/app/api/dataset-collaboration.api";
import { of } from "rxjs";
import {
    mockDatasetListCollaboratorsQuery,
    mockDatasetSearchCollaboratorQuery,
    mockDatasetUserRoleQuery,
    mockSetRoleCollaboratorMutation,
    mockUnsetRoleCollaboratorMutation,
} from "src/app/api/mock/dataset-collaborations.mock";
import { TEST_ACCOUNT_ID, TEST_DATASET_ID } from "src/app/api/mock/dataset.mock";
import { AccountWithRoleConnection, DatasetAccessRole, NameLookupResult } from "src/app/api/kamu.graphql.interface";

describe("DatasetCollaborationsService", () => {
    let service: DatasetCollaborationsService;
    let datasetCollaborationApi: DatasetCollaborationApi;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
        toastrService = TestBed.inject(ToastrService);
        datasetCollaborationApi = TestBed.inject(DatasetCollaborationApi);
        service = TestBed.inject(DatasetCollaborationsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should fetch list collaborators", () => {
        const listCollaboratorsSpy = spyOn(datasetCollaborationApi, "listCollaborators").and.returnValue(
            of(mockDatasetListCollaboratorsQuery),
        );

        const subscription$ = service
            .listCollaborators({
                datasetId: TEST_DATASET_ID,
            })
            .subscribe((result: AccountWithRoleConnection) => {
                expect(result.totalCount).toEqual(1);
                expect(result.nodes[0].role).toEqual(
                    mockDatasetListCollaboratorsQuery.datasets.byId?.collaboration.accountRoles.nodes[0]
                        .role as DatasetAccessRole,
                );
            });

        expect(listCollaboratorsSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("should search collaborator", () => {
        const searchCollaboratorSpy = spyOn(datasetCollaborationApi, "searchCollaborator").and.returnValue(
            of(mockDatasetSearchCollaboratorQuery),
        );
        const page = 1;
        const perPage = 10;
        const query = "bmi";

        const subscription$ = service
            .searchCollaborator({
                query,
                filters: { byAccount: null },
                page,
                perPage,
            })
            .subscribe((result: NameLookupResult[]) => {
                expect(result.length).toEqual(1);
                expect(result[0].accountName).toEqual(
                    mockDatasetSearchCollaboratorQuery.search.nameLookup.nodes[0].accountName,
                );
            });

        expect(searchCollaboratorSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("should set role for collaborator", () => {
        const setRoleCollaboratorSpy = spyOn(datasetCollaborationApi, "setRoleCollaborator").and.returnValue(
            of(mockSetRoleCollaboratorMutation),
        );
        const successSpy = spyOn(toastrService, "success");
        const role = DatasetAccessRole.Editor;

        const subscription$ = service
            .setRoleCollaborator({
                datasetId: TEST_DATASET_ID,
                accountId: TEST_ACCOUNT_ID,
                role,
            })
            .subscribe(() => {
                expect(successSpy).toHaveBeenCalledWith(
                    mockSetRoleCollaboratorMutation.datasets.byId?.collaboration.setRole.message,
                );
            });

        expect(setRoleCollaboratorSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("should unset role for collaborator", () => {
        const unsetRoleCollaboratorSpy = spyOn(datasetCollaborationApi, "unsetRoleCollaborator").and.returnValue(
            of(mockUnsetRoleCollaboratorMutation),
        );
        const successSpy = spyOn(toastrService, "success");

        const subscription$ = service
            .unsetRoleCollaborator({
                datasetId: TEST_DATASET_ID,
                accountIds: [TEST_ACCOUNT_ID],
            })
            .subscribe(() => {
                expect(successSpy).toHaveBeenCalledWith(
                    mockUnsetRoleCollaboratorMutation.datasets.byId?.collaboration.unsetRoles.message,
                );
            });

        expect(unsetRoleCollaboratorSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("should get role by dataset Id", () => {
        const getDatasetUserRoleSpy = spyOn(datasetCollaborationApi, "getDatasetUserRole").and.returnValue(
            of(mockDatasetUserRoleQuery),
        );

        const subscription$ = service.getRoleByDatasetId(TEST_DATASET_ID).subscribe((result) => {
            expect(result).toEqual(mockDatasetUserRoleQuery.datasets.byId?.role as DatasetAccessRole);
        });

        expect(getDatasetUserRoleSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });
});
