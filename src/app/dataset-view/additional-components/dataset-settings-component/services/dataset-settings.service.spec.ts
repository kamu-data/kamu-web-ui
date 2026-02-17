/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { importProvidersFrom } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";

import { of } from "rxjs";

import { DatasetNotFoundError, DatasetOperationError } from "@common/values/errors";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";
import { DatasetApi } from "src/app/api/dataset.api";
import { DeleteDatasetMutation, RenameDatasetMutation } from "src/app/api/kamu.graphql.interface";
import { TEST_ACCOUNT_ID } from "src/app/api/mock/auth.mock";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import {
    mockDeleteDanglingReferenceError,
    mockDeleteSuccessResponse,
    mockRenameResultNameCollision,
    mockRenameResultNoChanges,
    mockRenameSuccessResponse,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetSettingsService } from "./dataset-settings.service";

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
                provideAnimations(),
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
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
        const deleteDatasetSpy = spyOn(datasetApi, "deleteDataset").and.returnValue(of(mockDeleteSuccessResponse));
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        const navigateToSearchSpy = spyOn(navigationService, "navigateToSearch");

        service.deleteDataset(ACCOUNT_NAME, DATASET_ID).subscribe(() => {
            expect(deleteDatasetSpy).toHaveBeenCalledTimes(1);
            expect(navigateToSearchSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check delete dataset with dangling reference error", () => {
        spyOn(datasetApi, "deleteDataset").and.returnValue(of(mockDeleteDanglingReferenceError));
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);

        const subscription$ = service.deleteDataset(ACCOUNT_NAME, DATASET_ID).subscribe({
            next: () => fail("unexpected success"),
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
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        spyOn(datasetApi, "deleteDataset").and.returnValue(of({ datasets: {} } as DeleteDatasetMutation));

        const subscription$ = service.deleteDataset(ACCOUNT_NAME, DATASET_ID).subscribe({
            next: () => fail("unexpected success"),
            error: (e: unknown) => {
                expect(e).toEqual(new DatasetNotFoundError());
            },
        });

        expect(subscription$.closed).toEqual(true);
    });

    it("deleting dataset without logged user results in exception", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(false);

        expect(() => service.deleteDataset(ACCOUNT_NAME, DATASET_ID)).toThrow(
            new DatasetOperationError([new Error(DatasetSettingsService.NOT_LOGGED_USER_ERROR)]),
        );
    });

    it("should check rename dataset with success", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        const deleteDatasetSpy = spyOn(datasetApi, "renameDataset").and.returnValue(of(mockRenameSuccessResponse));
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
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        const emitRenameDatasetErrorOccurredSpy = spyOn(service, "emitRenameDatasetErrorOccurred").and.callThrough();
        const deleteDatasetSpy = spyOn(datasetApi, "renameDataset").and.returnValue(of(mockRenameResultNameCollision));
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
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        const emitRenameDatasetErrorOccurredSpy = spyOn(service, "emitRenameDatasetErrorOccurred").and.callThrough();
        const deleteDatasetSpy = spyOn(datasetApi, "renameDataset").and.returnValue(of(mockRenameResultNoChanges));
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
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        spyOn(datasetApi, "renameDataset").and.returnValue(of({ datasets: {} } as RenameDatasetMutation));

        const subscription$ = service
            .renameDataset({
                accountId: TEST_ACCOUNT_ID,
                accountName: ACCOUNT_NAME,
                datasetId: DATASET_ID,
                newName: NEW_NAME,
            })
            .subscribe({
                next: () => fail("unexpected success"),
                error: (e: unknown) => {
                    expect(e).toEqual(new DatasetNotFoundError());
                },
            });

        expect(subscription$.closed).toEqual(true);
    });

    it("renaming dataset without logged user results in exception", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(false);

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
