/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import {
    ActivatedRouteSnapshot,
    convertToParamMap,
    RedirectCommand,
    ResolveFn,
    Router,
    RouterStateSnapshot,
} from "@angular/router";

import { firstValueFrom, Observable, of } from "rxjs";

import { Apollo } from "apollo-angular";

import { DatasetBasicsFragment, DatasetPermissionsFragment } from "@api/kamu.graphql.interface";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";
import { MaybeNull } from "@interface/app.types";

import { EditPollingSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/edit-polling-source.service";
import { addPollingSourceResolverFn } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/resolver/add-polling-source.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("addPollingSourceResolverFn", () => {
    const TEST_EVENT_YAML = "kind: SetPollingSource";

    let editService: EditPollingSourceService;
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let router: Router;

    const executeResolver: ResolveFn<MaybeNull<string>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => addPollingSourceResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        editService = TestBed.inject(EditPollingSourceService);
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        router = TestBed.inject(Router);
        spyOn(datasetService, "requestDatasetBasicDataWithPermissions").and.returnValue(of(undefined));
    });

    function resolve(datasetBasics: DatasetBasicsFragment, permissions: DatasetPermissionsFragment): Promise<unknown> {
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(datasetBasics));
        spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(of(permissions));
        const route = {
            paramMap: convertToParamMap({
                [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
            }),
        } as ActivatedRouteSnapshot;
        return firstValueFrom(executeResolver(route, {} as RouterStateSnapshot) as Observable<unknown>);
    }

    function expectOverviewRedirect(data: unknown): void {
        expect(data).toBeInstanceOf(RedirectCommand);
        const redirectUrl = router.serializeUrl((data as RedirectCommand).redirectTo);
        expect(redirectUrl).toEqual(`/${TEST_ACCOUNT_NAME}/${TEST_DATASET_NAME}`);
    }

    it("should resolve the event YAML of an editable dataset", async () => {
        const getEventAsYamlSpy = spyOn(editService, "getEventAsYaml").and.returnValue(of(TEST_EVENT_YAML));

        const data = await resolve(mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment);

        expect(getEventAsYamlSpy).toHaveBeenCalledOnceWith({
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
        });
        expect(data).toEqual(TEST_EVENT_YAML);
    });

    it("should redirect to the dataset overview without loading the event when the user may not commit", async () => {
        const getEventAsYamlSpy = spyOn(editService, "getEventAsYaml").and.stub();

        const data = await resolve(mockDatasetBasicsRootFragment, mockReadonlyDatasetPermissionsFragment);

        expectOverviewRedirect(data);
        expect(getEventAsYamlSpy).not.toHaveBeenCalled();
    });

    it("should redirect to the dataset overview without loading the event for a dataset of another kind", async () => {
        const getEventAsYamlSpy = spyOn(editService, "getEventAsYaml").and.stub();

        const data = await resolve(mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment);

        expectOverviewRedirect(data);
        expect(getEventAsYamlSpy).not.toHaveBeenCalled();
    });
});
