/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { Observable, of, Subscription } from "rxjs";
import { first } from "rxjs/operators";

import { Apollo } from "apollo-angular";
import type { Mock } from "vitest";

import { requireValue } from "@common/helpers/app.helpers";
import { DatasetNotFoundError, DatasetOperationError } from "@common/values/errors";
import { DatasetApi } from "@api/dataset.api";
import { CommitEventToDatasetMutation, UpdateReadmeMutation } from "@api/kamu.graphql.interface";
import { TEST_ACCOUNT_ID } from "@api/mock/auth.mock";
import { mockDatasetByAccountAndDatasetNameQuery } from "@api/mock/dataset.mock";
import { MaybeUndefined } from "@interface/app.types";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import {
    mockCommitEventToDataseMetadataManifestMalformedError,
    mockCommitEventToDataseMetadataManifestUnsupportedVersionError,
    mockCommitEventToDatasetErrorMessage,
    mockCommitEventToDatasetMutation,
    mockCommitEventToDatasetResultAppendError,
    mockUpdateReadmeErrorMessage,
    mockUpdateReadmeSuccessResponse,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("DatasetCommitService", () => {
    let commitService: DatasetCommitService;
    let datasetApi: DatasetApi;
    let navigationService: NavigationService;
    let loggedUserService: LoggedUserService;

    let getDatasetInfoSpy: Mock;
    let navigationServiceSpy: Mock;

    const TEST_ACCOUNT_NAME = "accountName";
    const TEST_DATASET_NAME = "datasetName";
    const TEST_DATASET_ID = requireValue(mockDatasetByAccountAndDatasetNameQuery.datasets.byOwnerAndName ?? null).id;
    const TEST_EVENT_CONTENT = "event content";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideHttpClient(), provideHttpClientTesting()],
        });
        datasetApi = TestBed.inject(DatasetApi);
        navigationService = TestBed.inject(NavigationService);
        commitService = TestBed.inject(DatasetCommitService);
        loggedUserService = TestBed.inject(LoggedUserService);

        getDatasetInfoSpy = vi
            .spyOn(datasetApi, "getDatasetInfoByAccountAndDatasetName")
            .mockReturnValue(of(mockDatasetByAccountAndDatasetNameQuery));
        navigationServiceSpy = vi.spyOn(navigationService, "navigateToDatasetView").mockImplementation(() => {});
    });

    it("should be created", () => {
        expect(commitService).toBeTruthy();
    });

    function requestDatasetId(): Observable<MaybeUndefined<string>> {
        return commitService.getIdByAccountNameAndDatasetName(TEST_ACCOUNT_NAME, TEST_DATASET_NAME);
    }

    function requestCommitEvent(): Observable<boolean> {
        return commitService.commitEventToDataset({
            accountId: TEST_ACCOUNT_ID,
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
            event: TEST_EVENT_CONTENT,
        });
    }

    function expectNavigatedToDatasetOverview() {
        expect(navigationServiceSpy).toHaveBeenCalledTimes(1);
        expect(navigationServiceSpy).toHaveBeenCalledWith({
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
            tab: DatasetViewTypeEnum.Overview,
        });
    }

    it("should check getIdByAccountNameAndDatasetName() method with cache", fakeAsync(() => {
        // 1st requests queries the API
        let eventsCount = 0;
        requestDatasetId().subscribe((data) => {
            ++eventsCount;
            expect(data).toEqual(TEST_DATASET_ID);
            tick();

            // Issue 2nd request after first to ensure previous value was cached
            requestDatasetId().subscribe((data) => {
                ++eventsCount;
                expect(data).toEqual(TEST_DATASET_ID);
                tick();
            });
        });
        flush();

        expect(eventsCount).toEqual(2);
        expect(getDatasetInfoSpy).toHaveBeenCalledTimes(1);
        expect(getDatasetInfoSpy).toHaveBeenCalledWith(TEST_ACCOUNT_NAME, TEST_DATASET_NAME);
    }));

    it("should check getIdByAccountNameAndDatasetName() method without cache", fakeAsync(() => {
        let eventsCount = 0;
        requestDatasetId().subscribe((data) => {
            ++eventsCount;
            expect(data).toEqual(TEST_DATASET_ID);
            tick();
        });
        flush();

        expect(eventsCount).toEqual(1);
        expect(getDatasetInfoSpy).toHaveBeenCalledTimes(1);
        expect(getDatasetInfoSpy).toHaveBeenCalledWith(TEST_ACCOUNT_NAME, TEST_DATASET_NAME);
    }));

    it("should check getIdByAccountNameAndDatasetName() method with not found error", fakeAsync(() => {
        getDatasetInfoSpy = getDatasetInfoSpy.mockReturnValue(of({ datasets: {} }));

        const subscription$ = requestDatasetId().subscribe({
            next: () => expect.fail("unexpected success"),
            error: (e: unknown) => {
                expect(e instanceof DatasetNotFoundError).toBe(true);
            },
        });

        expect(subscription$.closed).toEqual(true);
    }));

    it("should check commitEventToDataset() method", fakeAsync(() => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        const commitEventSpy = vi
            .spyOn(datasetApi, "commitEvent")
            .mockReturnValue(of(mockCommitEventToDatasetMutation));

        requestCommitEvent().subscribe((result) => {
            tick();
            expect(result).toEqual(true);
        });
        flush();

        expect(commitEventSpy).toHaveBeenCalledTimes(1);

        expect(commitEventSpy).toHaveBeenCalledWith({
            datasetId: TEST_DATASET_ID,
            event: TEST_EVENT_CONTENT,
            accountId: TEST_ACCOUNT_ID,
        });
        // expectNavigatedToDatasetOverview();
    }));

    [mockCommitEventToDatasetResultAppendError, mockCommitEventToDataseMetadataManifestMalformedError].forEach(
        (errorResponse: CommitEventToDatasetMutation) => {
            it("should check commitEventToDataset() method with soft error", fakeAsync(() => {
                vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
                const commitEventSpy = vi.spyOn(datasetApi, "commitEvent").mockReturnValue(of(errorResponse));

                const errorSubscription$: Subscription = commitService.commitEventErrorOccurrences
                    .pipe(first())
                    .subscribe((message) => {
                        expect(message).toEqual(mockCommitEventToDatasetErrorMessage);
                    });

                requestCommitEvent().subscribe(() => {
                    tick();
                });
                flush();

                expect(commitEventSpy).toHaveBeenCalledTimes(1);

                expect(commitEventSpy).toHaveBeenCalledWith({
                    datasetId: TEST_DATASET_ID,
                    event: TEST_EVENT_CONTENT,
                    accountId: TEST_ACCOUNT_ID,
                });
                expect(navigationServiceSpy).not.toHaveBeenCalled();

                // If error triggered, our subscription will be closed
                expect(errorSubscription$.closed).toBe(true);
            }));
        },
    );

    it("should check commitEventToDataset() method with MetadataManifestUnsupportedVersionError error", fakeAsync(() => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        vi.spyOn(datasetApi, "commitEvent").mockReturnValue(
            of(mockCommitEventToDataseMetadataManifestUnsupportedVersionError),
        );

        const subscription$ = requestCommitEvent().subscribe({
            next: (result) => {
                expect(result).toBe(false);
            },
            error: (e: unknown) => {
                expect(e instanceof DatasetOperationError).toBe(true);
            },
        });

        expect(subscription$.closed).toEqual(true);
    }));

    it("should check commit to dataset when not found", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        const notFoundResponse: CommitEventToDatasetMutation = { datasets: { byId: null } };
        vi.spyOn(datasetApi, "commitEvent").mockReturnValue(of(notFoundResponse));

        const subscription$ = requestCommitEvent().subscribe({
            next: () => expect.fail("unexpected success"),
            error: (e: unknown) => {
                expect(e instanceof DatasetNotFoundError).toBe(true);
            },
        });

        expect(subscription$.closed).toEqual(true);
    });

    it("commit to dataset without logged user results in exception", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(false);

        expect(() => requestCommitEvent()).toThrow(
            new DatasetOperationError([new Error(DatasetCommitService.NOT_LOGGED_USER_ERROR)]),
        );
    });

    it("should check updateReadme() method ", fakeAsync(() => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        const updateReadmeSpy = vi
            .spyOn(datasetApi, "updateReadme")
            .mockReturnValue(of(mockUpdateReadmeSuccessResponse));
        const README_CONTENT = "readme content";

        commitService
            .updateReadme({
                accountId: TEST_ACCOUNT_ID,
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                content: README_CONTENT,
            })
            .subscribe(() => {
                tick();
            });
        flush();

        expect(updateReadmeSpy).toHaveBeenCalledTimes(1);

        expect(updateReadmeSpy).toHaveBeenCalledWith({
            accountId: TEST_ACCOUNT_ID,
            datasetId: TEST_DATASET_ID,
            content: README_CONTENT,
        });
        expectNavigatedToDatasetOverview();
    }));

    it("should check update readme for dataset when not found", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        const notFoundResponse: UpdateReadmeMutation = { datasets: { byId: null } };
        vi.spyOn(datasetApi, "updateReadme").mockReturnValue(of(notFoundResponse));

        const README_CONTENT = "readme content";
        const subscription$ = commitService
            .updateReadme({
                accountId: TEST_ACCOUNT_ID,
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                content: README_CONTENT,
            })
            .subscribe({
                next: () => expect.fail("unexpected success"),
                error: (e: unknown) => {
                    expect(e instanceof DatasetNotFoundError).toBe(true);
                },
            });

        expect(subscription$.closed).toEqual(true);
    });

    it("should check updateReadme() method with hard error", fakeAsync(() => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
        vi.spyOn(datasetApi, "updateReadme").mockReturnValue(of(mockUpdateReadmeErrorMessage));

        const README_CONTENT = "readme content";
        const subscription$ = commitService
            .updateReadme({
                accountId: TEST_ACCOUNT_ID,
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                content: README_CONTENT,
            })
            .subscribe({
                next: () => expect.fail("unexpected success"),
                error: (e: unknown) => {
                    expect(e instanceof DatasetOperationError).toBe(true);
                },
            });

        expect(subscription$.closed).toEqual(true);
    }));

    it("updating readme for dataset without logged user results in exception", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(false);

        const README_CONTENT = "readme content";
        expect(() =>
            commitService.updateReadme({
                accountId: TEST_ACCOUNT_ID,
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                content: README_CONTENT,
            }),
        ).toThrow(new DatasetOperationError([new Error(DatasetCommitService.NOT_LOGGED_USER_ERROR)]));
    });
});
