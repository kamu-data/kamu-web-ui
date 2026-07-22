/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { DatasetOperationError } from "@common/values/errors";
import { DatasetApi } from "@api/dataset.api";
import {
    CreateDatasetAsCollectionMutation,
    CreateDatasetAsVersionedFileMutation,
    CreateDatasetFromSnapshotMutation,
    CreateEmptyDatasetMutation,
    DatasetKind,
    DatasetVisibility,
} from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("DatasetCreateService", () => {
    let service: DatasetCreateService;
    let datasetApi: DatasetApi;
    let navigationService: NavigationService;
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DatasetCreateService);
        datasetApi = TestBed.inject(DatasetApi);
        navigationService = TestBed.inject(NavigationService);
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should be create empty dataset with success", () => {
        const mockResponseSuccess: CreateEmptyDatasetMutation = {
            datasets: {
                createEmpty: {
                    message: "Success",
                    dataset: mockDatasetBasicsDerivedFragment,
                    __typename: "CreateDatasetResultSuccess",
                },
            },
        };
        spyOn(datasetApi, "createEmptyDataset").and.returnValue(of(mockResponseSuccess));
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const spyNavigateToDatasetView = spyOn(navigationService, "navigateToDatasetView");

        const datasetName = "my-test";
        service
            .createEmptyDataset({
                datasetKind: DatasetKind.Root,
                datasetAlias: datasetName,
                datasetVisibility: DatasetVisibility.Public,
            })
            .subscribe();

        expect(spyNavigateToDatasetView).toHaveBeenCalledWith({
            accountName: mockAccountDetails.accountName,
            datasetName: datasetName,
            tab: DatasetViewTypeEnum.Overview,
        });
    });

    it("should check creating empty dataset needs a logged user", () => {
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(null);

        const datasetName = "my-test";
        expect(() =>
            service.createEmptyDataset({
                datasetKind: DatasetKind.Root,
                datasetAlias: datasetName,
                datasetVisibility: DatasetVisibility.Public,
            }),
        ).toThrow(new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]));
    });

    it("should be create empty dataset with a name collision error", () => {
        const mockResponseError: CreateEmptyDatasetMutation = {
            datasets: {
                createEmpty: {
                    message: "Fail",
                    accountName: "",
                    datasetName: "",
                    __typename: "CreateDatasetResultNameCollision",
                },
            },
        };
        spyOn(datasetApi, "createEmptyDataset").and.returnValue(of(mockResponseError));
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const spyNavigateToDatasetView = spyOn(navigationService, "navigateToDatasetView");

        const datasetName = "my-test";
        service
            .createEmptyDataset({
                datasetKind: DatasetKind.Root,
                datasetAlias: datasetName,
                datasetVisibility: DatasetVisibility.Public,
            })
            .subscribe();

        expect(spyNavigateToDatasetView).not.toHaveBeenCalled();
        service.errorMessageChanges.subscribe((error) => {
            expect(error).toBe("Fail");
        });
    });

    it("should be create dataset using snapshot with success", () => {
        const mockResponseSuccess: CreateDatasetFromSnapshotMutation = {
            datasets: {
                createFromSnapshot: {
                    message: "Success",
                    dataset: {
                        ...mockDatasetBasicsDerivedFragment,
                    },
                    __typename: "CreateDatasetResultSuccess",
                },
            },
        };
        spyOn(datasetApi, "createDatasetFromSnapshot").and.returnValue(of(mockResponseSuccess));
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const spyNavigateToDatasetView = spyOn(navigationService, "navigateToDatasetView");

        service
            .createDatasetFromSnapshot({ snapshot: "mockSnapshot", datasetVisibility: DatasetVisibility.Public })
            .subscribe();

        expect(spyNavigateToDatasetView).toHaveBeenCalledWith({
            accountName: mockAccountDetails.accountName,
            datasetName: mockDatasetBasicsDerivedFragment.name,
            tab: DatasetViewTypeEnum.Overview,
        });
    });

    it("should check creating dataset from snapshot needs a logged user", () => {
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(null);

        expect(() =>
            service.createDatasetFromSnapshot({
                snapshot: "mockSnapshot",
                datasetVisibility: DatasetVisibility.Public,
            }),
        ).toThrow(new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]));
    });

    it("should be create dataset using snapshot with a name collision error", () => {
        const mockResponseError: CreateDatasetFromSnapshotMutation = {
            datasets: {
                createFromSnapshot: {
                    message: "Fail",
                    accountName: "",
                    datasetName: "",
                    __typename: "CreateDatasetResultNameCollision",
                },
            },
        };
        spyOn(datasetApi, "createDatasetFromSnapshot").and.returnValue(of(mockResponseError));
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const spyNavigateToDatasetView = spyOn(navigationService, "navigateToDatasetView");

        service
            .createDatasetFromSnapshot({ snapshot: "mockSnapshot", datasetVisibility: DatasetVisibility.Public })
            .subscribe();

        expect(spyNavigateToDatasetView).not.toHaveBeenCalled();
        service.errorMessageChanges.subscribe((error) => {
            expect(error).toBe("Fail");
        });
    });

    it("should create collection and navigate to its overview", () => {
        const mockResponse: CreateDatasetAsCollectionMutation = {
            datasets: {
                createCollection: {
                    message: "Success",
                    dataset: mockDatasetBasicsDerivedFragment,
                    __typename: "CreateDatasetResultSuccess",
                },
            },
        };
        const params = {
            datasetAlias: "my-collection",
            datasetVisibility: DatasetVisibility.Private,
        };
        spyOn(datasetApi, "createDatasetAsCollection").and.returnValue(of(mockResponse));
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        service.createCollection(params).subscribe();

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockAccountDetails.accountName,
            datasetName: mockDatasetBasicsDerivedFragment.name,
            tab: DatasetViewTypeEnum.Overview,
        });
    });

    it("should emit an error when collection creation fails", () => {
        const mockResponse: CreateDatasetAsCollectionMutation = {
            datasets: {
                createCollection: {
                    message: "Collection already exists",
                    __typename: "CreateDatasetResultNameCollision",
                },
            },
        };
        spyOn(datasetApi, "createDatasetAsCollection").and.returnValue(of(mockResponse));
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const emitErrorMessageChangedSpy = spyOn(service, "emitErrorMessageChanged");
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        service
            .createCollection({
                datasetAlias: "my-collection",
                datasetVisibility: DatasetVisibility.Public,
            })
            .subscribe();

        expect(emitErrorMessageChangedSpy).toHaveBeenCalledOnceWith("Collection already exists");
        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();
    });

    it("should require a logged user to create a collection", () => {
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(null);

        expect(() =>
            service.createCollection({
                datasetAlias: "my-collection",
                datasetVisibility: DatasetVisibility.Public,
            }),
        ).toThrow(new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]));
    });

    it("should create versioned file and navigate to its overview", () => {
        const mockResponse: CreateDatasetAsVersionedFileMutation = {
            datasets: {
                createVersionedFile: {
                    message: "Success",
                    dataset: mockDatasetBasicsDerivedFragment,
                    __typename: "CreateDatasetResultSuccess",
                },
            },
        };
        const params = {
            datasetAlias: "my-versioned-file",
            datasetVisibility: DatasetVisibility.Private,
        };
        spyOn(datasetApi, "createDatasetAsVersionedFile").and.returnValue(of(mockResponse));
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        service.createVersionedFile(params).subscribe();

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockAccountDetails.accountName,
            datasetName: mockDatasetBasicsDerivedFragment.name,
            tab: DatasetViewTypeEnum.Overview,
        });
    });

    it("should emit an error when versioned file creation fails", () => {
        const mockResponse: CreateDatasetAsVersionedFileMutation = {
            datasets: {
                createVersionedFile: {
                    message: "Versioned file already exists",
                    __typename: "CreateDatasetResultNameCollision",
                },
            },
        };
        spyOn(datasetApi, "createDatasetAsVersionedFile").and.returnValue(of(mockResponse));
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const emitErrorMessageChangedSpy = spyOn(service, "emitErrorMessageChanged");
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        service
            .createVersionedFile({
                datasetAlias: "my-versioned-file",
                datasetVisibility: DatasetVisibility.Public,
            })
            .subscribe();

        expect(emitErrorMessageChangedSpy).toHaveBeenCalledOnceWith("Versioned file already exists");
        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();
    });

    it("should require a logged user to create a versioned file", () => {
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(null);

        expect(() =>
            service.createVersionedFile({
                datasetAlias: "my-versioned-file",
                datasetVisibility: DatasetVisibility.Public,
            }),
        ).toThrow(new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]));
    });
});
