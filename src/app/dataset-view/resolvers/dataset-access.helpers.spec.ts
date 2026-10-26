/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { RedirectCommand } from "@angular/router";

import { firstValueFrom, of, Subject, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import type { Mock } from "vitest";

import { expectPageNotFoundRedirect, expectRedirectTo } from "@common/helpers/base-test.helpers.spec";
import { DatasetNotFoundError } from "@common/values/errors";
import { DatasetBasicsFragment, DatasetKind, DatasetPermissionsFragment } from "@api/kamu.graphql.interface";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";
import { DatasetInfo } from "@interface/navigation.interface";

import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    requestDatasetWithPermissions,
    requestEditableDataset,
} from "src/app/dataset-view/resolvers/dataset-access.helpers";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("dataset access helpers", () => {
    const datasetInfo: DatasetInfo = { accountName: TEST_ACCOUNT_NAME, datasetName: TEST_DATASET_NAME };

    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
    });

    function mockDataset(
        datasetBasics: DatasetBasicsFragment = mockDatasetBasicsRootFragment,
        datasetPermissions: DatasetPermissionsFragment = mockFullPowerDatasetPermissionsFragment,
    ): Mock {
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(datasetBasics));
        vi.spyOn(datasetSubsService, "permissionsChanges", "get").mockReturnValue(of(datasetPermissions));
        return vi.spyOn(datasetService, "requestDatasetBasicDataWithPermissions").mockReturnValue(of(undefined));
    }

    describe("requestDatasetWithPermissions", () => {
        function resolve(): Promise<unknown> {
            return firstValueFrom(TestBed.runInInjectionContext(() => requestDatasetWithPermissions(datasetInfo)));
        }

        it("should emit the dataset with its permissions once they are loaded", async () => {
            const requestSpy = mockDataset();

            const data = await resolve();

            expect(requestSpy).toHaveBeenCalledTimes(1);

            expect(requestSpy).toHaveBeenCalledWith(datasetInfo);
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            });
        });

        it("should not emit before the dataset request completes", () => {
            vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(mockDatasetBasicsRootFragment));
            vi.spyOn(datasetSubsService, "permissionsChanges", "get").mockReturnValue(
                of(mockFullPowerDatasetPermissionsFragment),
            );
            const request$ = new Subject<void>();
            vi.spyOn(datasetService, "requestDatasetBasicDataWithPermissions").mockReturnValue(request$);
            const emitted: unknown[] = [];

            TestBed.runInInjectionContext(() => requestDatasetWithPermissions(datasetInfo)).subscribe((data) =>
                emitted.push(data),
            );
            expect(emitted).toEqual([]);

            request$.next();

            expect(emitted).toEqual([
                {
                    datasetBasics: mockDatasetBasicsRootFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                },
            ]);
        });

        it("should redirect to page not found when the dataset does not exist", async () => {
            vi.spyOn(datasetService, "requestDatasetBasicDataWithPermissions").mockReturnValue(
                throwError(() => new DatasetNotFoundError()),
            );

            const data = await resolve();

            expectPageNotFoundRedirect(data);
        });

        it("should propagate other errors", async () => {
            vi.spyOn(datasetService, "requestDatasetBasicDataWithPermissions").mockReturnValue(
                throwError(() => new Error("failed")),
            );

            await expect(resolve()).rejects.toThrowError("failed");
        });
    });

    describe("requestEditableDataset", () => {
        function resolve(expectedKind: DatasetKind): Promise<unknown> {
            return firstValueFrom(
                TestBed.runInInjectionContext(() => requestEditableDataset(datasetInfo, expectedKind)),
            );
        }

        function expectOverviewRedirect(data: unknown): void {
            expect(data).toBeInstanceOf(RedirectCommand);
            expectRedirectTo(data, `/${TEST_ACCOUNT_NAME}/${TEST_DATASET_NAME}`);
            if (data instanceof RedirectCommand) {
                expect(data.navigationBehaviorOptions?.skipLocationChange).toBeFalsy();
            }
        }

        it("should emit the dataset when the user may commit to it and it has the expected kind", async () => {
            mockDataset(mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment);

            const data = await resolve(DatasetKind.Root);

            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            });
        });

        it("should redirect to the dataset overview when the user may not commit to it", async () => {
            mockDataset(mockDatasetBasicsRootFragment, mockReadonlyDatasetPermissionsFragment);

            const data = await resolve(DatasetKind.Root);

            expectOverviewRedirect(data);
        });

        it("should redirect to the dataset overview when the dataset has another kind", async () => {
            mockDataset(mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment);

            const data = await resolve(DatasetKind.Root);

            expectOverviewRedirect(data);
        });

        it("should redirect to page not found when the dataset does not exist", async () => {
            vi.spyOn(datasetService, "requestDatasetBasicDataWithPermissions").mockReturnValue(
                throwError(() => new DatasetNotFoundError()),
            );

            const data = await resolve(DatasetKind.Root);

            expectPageNotFoundRedirect(data);
        });
    });
});
