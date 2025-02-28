/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeUndefined } from "../../../../interface/app.types";
import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { DatasetCommitService } from "./dataset-commit.service";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetApi } from "src/app/api/dataset.api";
import { Observable, Subscription, of } from "rxjs";
import {
    mockCommitEventToDataseMetadataManifestMalformedError,
    mockCommitEventToDataseMetadataManifestUnsupportedVersionError,
    mockCommitEventToDatasetErrorMessage,
    mockCommitEventToDatasetMutation,
    mockCommitEventToDatasetResultAppendError,
    mockDatasetMainDataId,
    mockDatasetMainDataResponse,
    mockUpdateReadmeErrorMessage,
    mockUpdateReadmeSuccessResponse,
} from "src/app/search/mock.data";
import {
    CommitEventToDatasetMutation,
    DatasetByAccountAndDatasetNameQuery,
    UpdateReadmeMutation,
} from "src/app/api/kamu.graphql.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { first } from "rxjs/operators";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetNotFoundError, DatasetOperationError } from "src/app/common/values/errors";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TEST_ACCOUNT_ID } from "src/app/api/mock/auth.mock";

describe("DatasetCommitService", () => {
    let commitService: DatasetCommitService;
    let datasetApi: DatasetApi;
    let navigationService: NavigationService;
    let loggedUserService: LoggedUserService;

    let getDatasetInfoSpy: jasmine.Spy;
    let navigationServiceSpy: jasmine.Spy;

    const TEST_ACCOUNT_NAME = "accountName";
    const TEST_DATASET_NAME = "datasetName";
    const TEST_DATASET_ID: string = mockDatasetMainDataId;
    const TEST_EVENT_CONTENT = "event content";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule, HttpClientTestingModule],
        });
        datasetApi = TestBed.inject(DatasetApi);
        navigationService = TestBed.inject(NavigationService);
        commitService = TestBed.inject(DatasetCommitService);
        loggedUserService = TestBed.inject(LoggedUserService);

        getDatasetInfoSpy = spyOn(datasetApi, "getDatasetInfoByAccountAndDatasetName").and.returnValue(
            of(mockDatasetMainDataResponse as DatasetByAccountAndDatasetNameQuery),
        );
        navigationServiceSpy = spyOn(navigationService, "navigateToDatasetView");
    });

    it("should be created", () => {
        expect(commitService).toBeTruthy();
    });

    function requestDatasetId(): Observable<MaybeUndefined<string>> {
        return commitService.getIdByAccountNameAndDatasetName(TEST_ACCOUNT_NAME, TEST_DATASET_NAME);
    }

    function requestCommitEvent(): Observable<void> {
        return commitService.commitEventToDataset({
            accountId: TEST_ACCOUNT_ID,
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
            event: TEST_EVENT_CONTENT,
        });
    }

    function expectNavigatedToDatasetOverview() {
        expect(navigationServiceSpy).toHaveBeenCalledOnceWith({
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
        expect(getDatasetInfoSpy).toHaveBeenCalledOnceWith(TEST_ACCOUNT_NAME, TEST_DATASET_NAME);
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
        expect(getDatasetInfoSpy).toHaveBeenCalledOnceWith(TEST_ACCOUNT_NAME, TEST_DATASET_NAME);
    }));

    it("should check getIdByAccountNameAndDatasetName() method with not found error", fakeAsync(() => {
        getDatasetInfoSpy = getDatasetInfoSpy.and.returnValue(of({ datasets: {} }));

        const subscription$ = requestDatasetId().subscribe({
            next: () => fail("unexpected success"),
            error: (e: unknown) => {
                expect(e instanceof DatasetNotFoundError).toBeTrue();
            },
        });

        expect(subscription$.closed).toEqual(true);
    }));

    it("should check commitEventToDataset() method", fakeAsync(() => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        const commitEventSpy = spyOn(datasetApi, "commitEvent").and.returnValue(of(mockCommitEventToDatasetMutation));

        requestCommitEvent().subscribe(() => {
            tick();
        });
        flush();

        expect(commitEventSpy).toHaveBeenCalledOnceWith({
            datasetId: TEST_DATASET_ID,
            event: TEST_EVENT_CONTENT,
            accountId: TEST_ACCOUNT_ID,
        });
        expectNavigatedToDatasetOverview();
    }));

    [mockCommitEventToDatasetResultAppendError, mockCommitEventToDataseMetadataManifestMalformedError].forEach(
        (errorResponse: CommitEventToDatasetMutation) => {
            it("should check commitEventToDataset() method with soft error", fakeAsync(() => {
                spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
                const commitEventSpy = spyOn(datasetApi, "commitEvent").and.returnValue(of(errorResponse));

                const errorSubscription$: Subscription = commitService.commitEventErrorOccurrences
                    .pipe(first())
                    .subscribe((message) => {
                        expect(message).toEqual(mockCommitEventToDatasetErrorMessage);
                    });

                requestCommitEvent().subscribe(() => {
                    tick();
                });
                flush();

                expect(commitEventSpy).toHaveBeenCalledOnceWith({
                    datasetId: TEST_DATASET_ID,
                    event: TEST_EVENT_CONTENT,
                    accountId: TEST_ACCOUNT_ID,
                });
                expect(navigationServiceSpy).not.toHaveBeenCalled();

                // If error triggered, our subscription will be closed
                expect(errorSubscription$.closed).toBeTrue();
            }));
        },
    );

    it("should check commitEventToDataset() method with hard error", fakeAsync(() => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        spyOn(datasetApi, "commitEvent").and.returnValue(
            of(mockCommitEventToDataseMetadataManifestUnsupportedVersionError),
        );

        const subscription$ = requestCommitEvent().subscribe({
            next: () => fail("unexpected success"),
            error: (e: unknown) => {
                expect(e instanceof DatasetOperationError).toBeTrue();
            },
        });

        expect(subscription$.closed).toEqual(true);
    }));

    it("should check commit to dataset when not found", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        spyOn(datasetApi, "commitEvent").and.returnValue(of({ datasets: {} } as CommitEventToDatasetMutation));

        const subscription$ = requestCommitEvent().subscribe({
            next: () => fail("unexpected success"),
            error: (e: unknown) => {
                expect(e instanceof DatasetNotFoundError).toBeTrue();
            },
        });

        expect(subscription$.closed).toEqual(true);
    });

    it("commit to dataset without logged user results in exception", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(false);

        expect(() => requestCommitEvent()).toThrow(
            new DatasetOperationError([new Error(DatasetCommitService.NOT_LOGGED_USER_ERROR)]),
        );
    });

    it("should check updateReadme() method ", fakeAsync(() => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        const updateReadmeSpy = spyOn(datasetApi, "updateReadme").and.returnValue(of(mockUpdateReadmeSuccessResponse));
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

        expect(updateReadmeSpy).toHaveBeenCalledOnceWith({
            accountId: TEST_ACCOUNT_ID,
            datasetId: TEST_DATASET_ID,
            content: README_CONTENT,
        });
        expectNavigatedToDatasetOverview();
    }));

    it("should check update readme for dataset when not found", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        spyOn(datasetApi, "updateReadme").and.returnValue(of({ datasets: {} } as UpdateReadmeMutation));

        const README_CONTENT = "readme content";
        const subscription$ = commitService
            .updateReadme({
                accountId: TEST_ACCOUNT_ID,
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                content: README_CONTENT,
            })
            .subscribe({
                next: () => fail("unexpected success"),
                error: (e: unknown) => {
                    expect(e instanceof DatasetNotFoundError).toBeTrue();
                },
            });

        expect(subscription$.closed).toEqual(true);
    });

    it("should check updateReadme() method with hard error", fakeAsync(() => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        spyOn(datasetApi, "updateReadme").and.returnValue(of(mockUpdateReadmeErrorMessage));

        const README_CONTENT = "readme content";
        const subscription$ = commitService
            .updateReadme({
                accountId: TEST_ACCOUNT_ID,
                accountName: TEST_ACCOUNT_NAME,
                datasetName: TEST_DATASET_NAME,
                content: README_CONTENT,
            })
            .subscribe({
                next: () => fail("unexpected success"),
                error: (e: unknown) => {
                    expect(e instanceof DatasetOperationError).toBeTrue();
                },
            });

        expect(subscription$.closed).toEqual(true);
    }));

    it("updating readme for dataset without logged user results in exception", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(false);

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
