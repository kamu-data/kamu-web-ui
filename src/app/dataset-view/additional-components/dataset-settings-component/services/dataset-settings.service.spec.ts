/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { importProvidersFrom } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { DatasetNotFoundError, DatasetOperationError } from "@common/values/errors";
import { DatasetApi } from "@api/dataset.api";
import { DeleteDatasetMutation, RenameDatasetMutation } from "@api/kamu.graphql.interface";
import { TEST_ACCOUNT_ID } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetSettingsService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-settings.service";
import {
    mockDeleteDanglingReferenceError,
    mockDeleteSuccessResponse,
    mockRenameResultNameCollision,
    mockRenameResultNoChanges,
    mockRenameSuccessResponse,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("DatasetSettingsService", () => {
    let service: DatasetSettingsService;
    let datasetApi: DatasetApi;
    let navigationService: NavigationService;
    let loggedUserService: LoggedUserService;

    const DATASET_ID = "mockDatasetId";
    const NEW_NAME = "mock-dataset-name";
    const ACCOUNT_NAME = "accountName";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Apollo,
                importProvidersFrom(ApolloTestingModule),
                provideToastr(),
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(DatasetSettingsService);
        navigationService = TestBed.inject(NavigationService);
        datasetApi = TestBed.inject(DatasetApi);
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check delete dataset with success", () => {
        const deleteDatasetSpy = vi.spyOn(datasetApi, "deleteDataset").mockReturnValue(of(mockDeleteSuccessResponse));
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        const navigateToSearchSpy = vi.spyOn(navigationService, "navigateToSearch").mockImplementation(() => {});

        service.deleteDataset(ACCOUNT_NAME, DATASET_ID).subscribe(() => {
            expect(deleteDatasetSpy).toHaveBeenCalledTimes(1);
            expect(navigateToSearchSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check delete dataset with dangling reference error", () => {
        vi.spyOn(datasetApi, "deleteDataset").mockReturnValue(of(mockDeleteDanglingReferenceError));
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);

        const subscription$ = service.deleteDataset(ACCOUNT_NAME, DATASET_ID).subscribe({
            next: () => expect.fail("unexpected success"),
            error: (e: unknown) => {
                expect(e).toEqual(
                    new DatasetOperationError([
                        new Error(mockDeleteDanglingReferenceError.datasets.byId?.delete.message),
                    ]),
                );
            },
        });

        expect(subscription$.closed).toEqual(true);
    });

    it("should check delete dataset when not found", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        const notFoundResponse: DeleteDatasetMutation = {
            datasets: { __typename: "DatasetsMut", byId: null },
        };
        vi.spyOn(datasetApi, "deleteDataset").mockReturnValue(of(notFoundResponse));

        const subscription$ = service.deleteDataset(ACCOUNT_NAME, DATASET_ID).subscribe({
            next: () => expect.fail("unexpected success"),
            error: (e: unknown) => {
                expect(e).toEqual(new DatasetNotFoundError());
            },
        });

        expect(subscription$.closed).toEqual(true);
    });

    it("deleting dataset without logged user results in exception", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(false);

        expect(() => service.deleteDataset(ACCOUNT_NAME, DATASET_ID)).toThrow(
            new DatasetOperationError([new Error(DatasetSettingsService.NOT_LOGGED_USER_ERROR)]),
        );
    });

    it("should check rename dataset with success", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        const deleteDatasetSpy = vi.spyOn(datasetApi, "renameDataset").mockReturnValue(of(mockRenameSuccessResponse));
        service
            .renameDataset({
                accountId: TEST_ACCOUNT_ID,
                accountName: ACCOUNT_NAME,
                datasetId: DATASET_ID,
                newName: NEW_NAME,
            })
            .subscribe(() => {
                expect(deleteDatasetSpy).toHaveBeenCalledTimes(1);
                expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
            });
    });

    it("should check rename dataset with name collision", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        const emitRenameDatasetErrorOccurredSpy = vi.spyOn(service, "emitRenameDatasetErrorOccurred");
        const deleteDatasetSpy = vi
            .spyOn(datasetApi, "renameDataset")
            .mockReturnValue(of(mockRenameResultNameCollision));
        service
            .renameDataset({
                accountId: TEST_ACCOUNT_ID,
                accountName: ACCOUNT_NAME,
                datasetId: DATASET_ID,
                newName: NEW_NAME,
            })
            .subscribe(() => {
                expect(deleteDatasetSpy).toHaveBeenCalledTimes(1);
                expect(emitRenameDatasetErrorOccurredSpy).toHaveBeenCalledTimes(1);
            });
    });

    it("should check rename dataset with no changes", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        const emitRenameDatasetErrorOccurredSpy = vi.spyOn(service, "emitRenameDatasetErrorOccurred");
        const deleteDatasetSpy = vi.spyOn(datasetApi, "renameDataset").mockReturnValue(of(mockRenameResultNoChanges));
        service
            .renameDataset({
                accountId: TEST_ACCOUNT_ID,
                accountName: ACCOUNT_NAME,
                datasetId: DATASET_ID,
                newName: NEW_NAME,
            })
            .subscribe(() => {
                expect(deleteDatasetSpy).toHaveBeenCalledTimes(1);
                expect(emitRenameDatasetErrorOccurredSpy).toHaveBeenCalledTimes(1);
            });
    });

    it("should check rename dataset when not found", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        const notFoundResponse: RenameDatasetMutation = {
            datasets: { __typename: "DatasetsMut", byId: null },
        };
        vi.spyOn(datasetApi, "renameDataset").mockReturnValue(of(notFoundResponse));

        const subscription$ = service
            .renameDataset({
                accountId: TEST_ACCOUNT_ID,
                accountName: ACCOUNT_NAME,
                datasetId: DATASET_ID,
                newName: NEW_NAME,
            })
            .subscribe({
                next: () => expect.fail("unexpected success"),
                error: (e: unknown) => {
                    expect(e).toEqual(new DatasetNotFoundError());
                },
            });

        expect(subscription$.closed).toEqual(true);
    });

    it("renaming dataset without logged user results in exception", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(false);

        expect(() =>
            service.renameDataset({
                accountId: TEST_ACCOUNT_ID,
                accountName: ACCOUNT_NAME,
                datasetId: DATASET_ID,
                newName: NEW_NAME,
            }),
        ).toThrow(new DatasetOperationError([new Error(DatasetSettingsService.NOT_LOGGED_USER_ERROR)]));
    });
});
