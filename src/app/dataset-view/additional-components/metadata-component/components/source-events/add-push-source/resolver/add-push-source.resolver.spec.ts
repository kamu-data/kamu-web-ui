/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, RedirectCommand } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import {
    expectPageNotFoundRedirect,
    expectRedirectTo,
    routeSnapshot,
    runResolver,
} from "@common/helpers/base-test.helpers.spec";
import { DatasetPermissionsFragment } from "@api/kamu.graphql.interface";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";
import { MaybeNull, MaybeNullOrUndefined } from "@interface/app.types";

import { EditAddPushSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/edit-add-push-source.service";
import { addPushSourceResolverFn } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/resolver/add-push-source.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("addPushSourceResolverFn", () => {
    let editService: EditAddPushSourceService;
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let getEventAsYamlSpy: jasmine.Spy;
    const TEST_SOURCE_NAME = "my-source";
    const TEST_EVENT_YAML = "kind: AddPushSource";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        editService = TestBed.inject(EditAddPushSourceService);
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        spyOn(datasetService, "requestDatasetBasicDataWithPermissions").and.returnValue(of(undefined));
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
    });

    function createRoute(sourceName?: string): ActivatedRouteSnapshot {
        return routeSnapshot({
            params: {
                [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
            },
            queryParams: sourceName ? { [ProjectLinks.URL_QUERY_PARAM_PUSH_SOURCE_NAME]: sourceName } : {},
        });
    }

    function resolve(
        route: ActivatedRouteSnapshot,
        eventYaml: MaybeNullOrUndefined<string>,
        permissions: DatasetPermissionsFragment = mockFullPowerDatasetPermissionsFragment,
    ): Promise<MaybeNull<string> | RedirectCommand> {
        spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(of(permissions));
        getEventAsYamlSpy = spyOn(editService, "getEventAsYaml").and.returnValue(of(eventYaml));
        return runResolver(addPushSourceResolverFn, route);
    }

    it("should resolve the YAML of the named push source", async () => {
        const data = await resolve(createRoute(TEST_SOURCE_NAME), TEST_EVENT_YAML);

        expect(getEventAsYamlSpy).toHaveBeenCalledOnceWith(
            { accountName: TEST_ACCOUNT_NAME, datasetName: TEST_DATASET_NAME },
            TEST_SOURCE_NAME,
        );
        expect(data).toEqual(TEST_EVENT_YAML);
    });

    it("should resolve null when no source name is given", async () => {
        const data = await resolve(createRoute(), null);

        expect(getEventAsYamlSpy).toHaveBeenCalledOnceWith(
            { accountName: TEST_ACCOUNT_NAME, datasetName: TEST_DATASET_NAME },
            "",
        );
        expect(data).toBeNull();
    });

    it("should redirect to page not found for an unknown source name", async () => {
        const data = await resolve(createRoute("unknown-source"), undefined);

        expectPageNotFoundRedirect(data);
    });

    it("should redirect to the dataset overview without loading the event when the user may not commit", async () => {
        const data = await resolve(
            createRoute(TEST_SOURCE_NAME),
            TEST_EVENT_YAML,
            mockReadonlyDatasetPermissionsFragment,
        );

        expectRedirectTo(data, `/${TEST_ACCOUNT_NAME}/${TEST_DATASET_NAME}`);
        expect(getEventAsYamlSpy).not.toHaveBeenCalled();
    });
});
