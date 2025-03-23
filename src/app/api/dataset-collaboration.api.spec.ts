/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { DatasetCollaborationApi } from "./dataset-collaboration.api";
import { TEST_DATASET_ID } from "./mock/dataset.mock";
import {
    DatasetAccessRole,
    DatasetListCollaboratorsDocument,
    DatasetListCollaboratorsQuery,
    SearchCollaboratorDocument,
    SearchCollaboratorQuery,
    SetRoleCollaboratorDocument,
    SetRoleCollaboratorMutation,
    UnsetRoleCollaboratorDocument,
    UnsetRoleCollaboratorMutation,
} from "./kamu.graphql.interface";
import {
    mockDatasetListCollaboratorsQuery,
    mockDatasetSearchCollaboratorQuery,
    mockSetRoleCollaboratorMutation,
    mockUnsetRoleCollaboratorMutation,
} from "./mock/dataset-collaborations.mock";
import { TEST_ACCOUNT_ID } from "./mock/auth.mock";

describe("DatasetCollaborationApi", () => {
    let service: DatasetCollaborationApi;
    let controller: ApolloTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DatasetCollaborationApi, Apollo],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(DatasetCollaborationApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check list collaborators", () => {
        service
            .listCollaborators({
                datasetId: TEST_DATASET_ID,
            })
            .subscribe((result: DatasetListCollaboratorsQuery) => {
                expect(result.datasets.byId?.collaboration.accountRoles.nodes.length).toEqual(1);
                expect(result.datasets.byId?.collaboration.accountRoles.nodes[0]).toEqual(
                    mockDatasetListCollaboratorsQuery.datasets.byId?.collaboration.accountRoles.nodes[0],
                );
            });

        const op = controller.expectOne(DatasetListCollaboratorsDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);

        op.flush({
            data: mockDatasetListCollaboratorsQuery,
        });
    });

    it("should check search collaborator", () => {
        const page = 1;
        const perPage = 10;
        const query = "bmi";
        service
            .searchCollaborator({
                query,
                filters: { byAccount: null },
                page,
                perPage,
            })
            .subscribe((result: SearchCollaboratorQuery) => {
                expect(result.search.nameLookup.nodes.length).toEqual(1);
                expect(result.search.nameLookup.nodes[0].accountName).toEqual(
                    mockDatasetSearchCollaboratorQuery.search.nameLookup.nodes[0].accountName,
                );
            });

        const op = controller.expectOne(SearchCollaboratorDocument);
        expect(op.operation.variables.query).toEqual(query);
        expect(op.operation.variables.page).toEqual(page);
        expect(op.operation.variables.perPage).toEqual(perPage);

        op.flush({
            data: mockDatasetSearchCollaboratorQuery,
        });
    });

    it("should check set role for a collaborator", () => {
        const role = DatasetAccessRole.Editor;
        service
            .setRoleCollaborator({
                datasetId: TEST_DATASET_ID,
                accountId: TEST_ACCOUNT_ID,
                role,
            })
            .subscribe((result: SetRoleCollaboratorMutation) => {
                expect(result.datasets.byId?.collaboration.setRole.message).toEqual(
                    mockSetRoleCollaboratorMutation.datasets.byId?.collaboration.setRole.message,
                );
            });

        const op = controller.expectOne(SetRoleCollaboratorDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.accountId).toEqual(TEST_ACCOUNT_ID);
        expect(op.operation.variables.role).toEqual(role);

        op.flush({
            data: mockSetRoleCollaboratorMutation,
        });
    });

    it("should check unset role for a collaborator", () => {
        service
            .unsetRoleCollaborator({
                datasetId: TEST_DATASET_ID,
                accountIds: [TEST_ACCOUNT_ID],
            })
            .subscribe((result: UnsetRoleCollaboratorMutation) => {
                expect(result.datasets.byId?.collaboration.unsetRoles.message).toEqual(
                    mockUnsetRoleCollaboratorMutation.datasets.byId?.collaboration.unsetRoles.message,
                );
            });

        const op = controller.expectOne(UnsetRoleCollaboratorDocument);
        expect(op.operation.variables.datasetId).toEqual(TEST_DATASET_ID);
        expect(op.operation.variables.accountIds).toEqual([TEST_ACCOUNT_ID]);

        op.flush({
            data: mockUnsetRoleCollaboratorMutation,
        });
    });
});
