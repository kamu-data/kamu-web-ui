/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { RedirectCommand, Router } from "@angular/router";

import { firstValueFrom, Observable, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect } from "@common/helpers/base-test.helpers.spec";

import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { pageNotFoundIf, requestOverviewTabData } from "src/app/dataset-view/resolvers/dataset-tab-data.helpers";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("dataset tab data helpers", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
    });

    describe("requestOverviewTabData", () => {
        let datasetService: DatasetService;
        let datasetSubsService: DatasetSubscriptionsService;

        beforeEach(() => {
            datasetService = TestBed.inject(DatasetService);
            datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
            spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
                of(mockFullPowerDatasetPermissionsFragment),
            );
            spyOnProperty(datasetSubsService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
        });

        function resolve(): Promise<unknown> {
            return firstValueFrom(TestBed.runInInjectionContext(() => requestOverviewTabData()));
        }

        it("should emit the dataset, its permissions and the overview", async () => {
            spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));

            const data = await resolve();

            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                overviewUpdate: mockOverviewUpdate,
            });
        });

        it("should redirect to page not found when the dataset cannot be loaded", async () => {
            spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(throwError(() => new Error("fail")));

            const data = await resolve();

            expectPageNotFoundRedirect(data);
        });
    });

    describe("pageNotFoundIf", () => {
        function apply(source: Observable<string | RedirectCommand>, isUnavailable: jasmine.Spy): Promise<unknown> {
            return firstValueFrom(
                source.pipe(TestBed.runInInjectionContext(() => pageNotFoundIf<string>(isUnavailable))),
            );
        }

        it("should pass the value through when it is available", async () => {
            const isUnavailable = jasmine.createSpy("isUnavailable").and.returnValue(false);

            const data = await apply(of("value"), isUnavailable);

            expect(data).toEqual("value");
            expect(isUnavailable).toHaveBeenCalledOnceWith("value");
        });

        it("should redirect to page not found when the value is unavailable", async () => {
            const isUnavailable = jasmine.createSpy("isUnavailable").and.returnValue(true);

            const data = await apply(of("value"), isUnavailable);

            expectPageNotFoundRedirect(data);
        });

        it("should pass a redirect from upstream through without checking it", async () => {
            const isUnavailable = jasmine.createSpy("isUnavailable");
            const upstreamRedirect = new RedirectCommand(TestBed.inject(Router).createUrlTree(["elsewhere"]));

            const data = await apply(of(upstreamRedirect), isUnavailable);

            expect(data).toBe(upstreamRedirect);
            expect(isUnavailable).not.toHaveBeenCalled();
        });
    });
});
