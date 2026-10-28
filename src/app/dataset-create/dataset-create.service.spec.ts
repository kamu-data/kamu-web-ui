/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of } from "rxjs";

import { Apollo } from "apollo-angular";

import { stubMethod } from "@common/helpers/base-test.helpers.spec";
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
            providers: [Apollo, provideHttpClient(), provideHttpClientTesting()],
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
                __typename: "DatasetsMut",
                createEmpty: {
                    message: "Success",
                    dataset: mockDatasetBasicsDerivedFragment,
                    __typename: "CreateDatasetResultSuccess",
                },
            },
        };
        vi.spyOn(datasetApi, "createEmptyDataset").mockReturnValue(of(mockResponseSuccess));
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const spyNavigateToDatasetView = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});

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
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(null);

        const datasetName = "my-test";
        expect(() =>
            service.createEmptyDataset({
                datasetKind: DatasetKind.Root,
                datasetAlias: datasetName,
                datasetVisibility: DatasetVisibility.Public,
            }),
        ).toThrow(new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]));
    });

    it("should return a name collision of an empty dataset as the name field's error", async () => {
        const mockResponseError: CreateEmptyDatasetMutation = {
            datasets: {
                __typename: "DatasetsMut",
                createEmpty: {
                    message: "Fail",
                    accountName: "",
                    datasetName: "",
                    __typename: "CreateDatasetResultNameCollision",
                },
            },
        };
        vi.spyOn(datasetApi, "createEmptyDataset").mockReturnValue(of(mockResponseError));
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const spyNavigateToDatasetView = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});

        const result = await firstValueFrom(
            service.createEmptyDataset({
                datasetKind: DatasetKind.Root,
                datasetAlias: "my-test",
                datasetVisibility: DatasetVisibility.Public,
            }),
        );

        expect(result).toEqual({ ok: false, fieldError: "Fail" });
        expect(spyNavigateToDatasetView).not.toHaveBeenCalled();
    });

    it("should be create dataset using snapshot with success", () => {
        const mockResponseSuccess: CreateDatasetFromSnapshotMutation = {
            datasets: {
                __typename: "DatasetsMut",
                createFromSnapshot: {
                    message: "Success",
                    dataset: {
                        ...mockDatasetBasicsDerivedFragment,
                    },
                    __typename: "CreateDatasetResultSuccess",
                },
            },
        };
        vi.spyOn(datasetApi, "createDatasetFromSnapshot").mockReturnValue(of(mockResponseSuccess));
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const spyNavigateToDatasetView = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});

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
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(null);

        expect(() =>
            service.createDatasetFromSnapshot({
                snapshot: "mockSnapshot",
                datasetVisibility: DatasetVisibility.Public,
            }),
        ).toThrow(new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]));
    });

    it("should return a name collision of a snapshot as its error", async () => {
        const mockResponseError: CreateDatasetFromSnapshotMutation = {
            datasets: {
                __typename: "DatasetsMut",
                createFromSnapshot: {
                    message: "Fail",
                    accountName: "",
                    datasetName: "",
                    __typename: "CreateDatasetResultNameCollision",
                },
            },
        };
        vi.spyOn(datasetApi, "createDatasetFromSnapshot").mockReturnValue(of(mockResponseError));
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const spyNavigateToDatasetView = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});

        const result = await firstValueFrom(
            service.createDatasetFromSnapshot({
                snapshot: "mockSnapshot",
                datasetVisibility: DatasetVisibility.Public,
            }),
        );

        expect(result).toEqual({ ok: false, fieldError: "Fail" });
        expect(spyNavigateToDatasetView).not.toHaveBeenCalled();
    });

    it("should create collection and navigate to its overview", () => {
        const mockResponse: CreateDatasetAsCollectionMutation = {
            datasets: {
                __typename: "DatasetsMut",
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
        vi.spyOn(datasetApi, "createDatasetAsCollection").mockReturnValue(of(mockResponse));
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});

        service.createCollection(params).subscribe();

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockAccountDetails.accountName,
            datasetName: mockDatasetBasicsDerivedFragment.name,
            tab: DatasetViewTypeEnum.Overview,
        });
    });

    it("should return a name collision of a collection as the name field's error", async () => {
        const mockResponse: CreateDatasetAsCollectionMutation = {
            datasets: {
                __typename: "DatasetsMut",
                createCollection: {
                    message: "Collection already exists",
                    __typename: "CreateDatasetResultNameCollision",
                },
            },
        };
        vi.spyOn(datasetApi, "createDatasetAsCollection").mockReturnValue(of(mockResponse));
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const navigateToDatasetViewSpy = stubMethod(navigationService, "navigateToDatasetView");

        const result = await firstValueFrom(
            service.createCollection({
                datasetAlias: "my-collection",
                datasetVisibility: DatasetVisibility.Public,
            }),
        );

        expect(result).toEqual({ ok: false, fieldError: "Collection already exists" });
        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();
    });

    it("should require a logged user to create a collection", () => {
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(null);

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
                __typename: "DatasetsMut",
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
        vi.spyOn(datasetApi, "createDatasetAsVersionedFile").mockReturnValue(of(mockResponse));
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});

        service.createVersionedFile(params).subscribe();

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockAccountDetails.accountName,
            datasetName: mockDatasetBasicsDerivedFragment.name,
            tab: DatasetViewTypeEnum.Overview,
        });
    });

    it("should return a name collision of a versioned file as the name field's error", async () => {
        const mockResponse: CreateDatasetAsVersionedFileMutation = {
            datasets: {
                __typename: "DatasetsMut",
                createVersionedFile: {
                    message: "Versioned file already exists",
                    __typename: "CreateDatasetResultNameCollision",
                },
            },
        };
        vi.spyOn(datasetApi, "createDatasetAsVersionedFile").mockReturnValue(of(mockResponse));
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        const navigateToDatasetViewSpy = stubMethod(navigationService, "navigateToDatasetView");

        const result = await firstValueFrom(
            service.createVersionedFile({
                datasetAlias: "my-versioned-file",
                datasetVisibility: DatasetVisibility.Public,
            }),
        );

        expect(result).toEqual({ ok: false, fieldError: "Versioned file already exists" });
        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();
    });

    it("should require a logged user to create a versioned file", () => {
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(null);

        expect(() =>
            service.createVersionedFile({
                datasetAlias: "my-versioned-file",
                datasetVisibility: DatasetVisibility.Public,
            }),
        ).toThrow(new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]));
    });
});
