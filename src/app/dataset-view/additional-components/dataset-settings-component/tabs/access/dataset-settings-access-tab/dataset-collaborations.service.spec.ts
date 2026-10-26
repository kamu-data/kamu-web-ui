/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { DatasetCollaborationApi } from "@api/dataset-collaboration.api";
import { AccountFragment, AccountWithRoleConnectionDataFragment, DatasetAccessRole } from "@api/kamu.graphql.interface";
import {
    MOCK_DATASET_USER_ROLE,
    mockDatasetCollaboratorsConnection,
    mockDatasetListCollaboratorsQuery,
    mockDatasetSearchCollaboratorQuery,
    mockDatasetUserRoleQuery,
    mockSetRoleCollaboratorMutation,
    mockUnsetRoleCollaboratorMutation,
} from "@api/mock/dataset-collaborations.mock";
import { TEST_ACCOUNT_ID, TEST_DATASET_ID } from "@api/mock/dataset.mock";

import { DatasetCollaborationsService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/dataset-collaborations.service";

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
        const listCollaboratorsSpy = vi
            .spyOn(datasetCollaborationApi, "listCollaborators")
            .mockReturnValue(of(mockDatasetListCollaboratorsQuery));

        const subscription$ = service
            .listCollaborators({
                datasetId: TEST_DATASET_ID,
            })
            .subscribe((result: AccountWithRoleConnectionDataFragment) => {
                expect(result.totalCount).toEqual(1);
                expect(result.nodes[0].role).toEqual(mockDatasetCollaboratorsConnection.nodes[0].role);
            });

        expect(listCollaboratorsSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("should search collaborator", () => {
        const searchCollaboratorSpy = vi
            .spyOn(datasetCollaborationApi, "searchCollaborator")
            .mockReturnValue(of(mockDatasetSearchCollaboratorQuery));
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
            .subscribe((result: AccountFragment[]) => {
                expect(result.length).toEqual(1);
                expect(result[0].accountName).toEqual(
                    mockDatasetSearchCollaboratorQuery.search.nameLookup.nodes[0].accountName,
                );
            });

        expect(searchCollaboratorSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("should set role for collaborator", () => {
        const setRoleCollaboratorSpy = vi
            .spyOn(datasetCollaborationApi, "setRoleCollaborator")
            .mockReturnValue(of(mockSetRoleCollaboratorMutation));
        const successSpy = stubMethod(toastrService, "success");
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
        expect(subscription$.closed).toBe(true);
    });

    it("should unset role for collaborator", () => {
        const unsetRoleCollaboratorSpy = vi
            .spyOn(datasetCollaborationApi, "unsetRoleCollaborator")
            .mockReturnValue(of(mockUnsetRoleCollaboratorMutation));
        const successSpy = stubMethod(toastrService, "success");

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
        expect(subscription$.closed).toBe(true);
    });

    it("should get role by dataset Id", () => {
        const getDatasetUserRoleSpy = vi
            .spyOn(datasetCollaborationApi, "getDatasetUserRole")
            .mockReturnValue(of(mockDatasetUserRoleQuery));

        const subscription$ = service.getRoleByDatasetId(TEST_DATASET_ID).subscribe((result) => {
            expect(result).toEqual(MOCK_DATASET_USER_ROLE);
        });

        expect(getDatasetUserRoleSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("should give no role when the dataset is not found", () => {
        vi.spyOn(datasetCollaborationApi, "getDatasetUserRole").mockReturnValue(of({ datasets: { byId: null } }));

        const subscription$ = service.getRoleByDatasetId(TEST_DATASET_ID).subscribe((result) => {
            expect(result).toBeNull();
        });

        expect(subscription$.closed).toBe(true);
    });
});
