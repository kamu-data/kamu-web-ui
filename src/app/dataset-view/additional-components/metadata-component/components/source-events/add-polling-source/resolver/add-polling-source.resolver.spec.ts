/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { RedirectCommand } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectRedirectTo, routeSnapshot, runResolver, stubMethod } from "@common/helpers/base-test.helpers.spec";
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

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        editService = TestBed.inject(EditPollingSourceService);
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        vi.spyOn(datasetService, "requestDatasetBasicDataWithPermissions").mockReturnValue(of(undefined));
    });

    function resolve(
        datasetBasics: DatasetBasicsFragment,
        permissions: DatasetPermissionsFragment,
    ): Promise<MaybeNull<string> | RedirectCommand> {
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(datasetBasics));
        vi.spyOn(datasetSubsService, "permissionsChanges", "get").mockReturnValue(of(permissions));
        const route = routeSnapshot({
            params: {
                [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
            },
        });
        return runResolver(addPollingSourceResolverFn, route);
    }

    function expectOverviewRedirect(data: unknown): void {
        expect(data).toBeInstanceOf(RedirectCommand);
        expectRedirectTo(data, `/${TEST_ACCOUNT_NAME}/${TEST_DATASET_NAME}`);
    }

    it("should resolve the event YAML of an editable dataset", async () => {
        const getEventAsYamlSpy = vi.spyOn(editService, "getEventAsYaml").mockReturnValue(of(TEST_EVENT_YAML));

        const data = await resolve(mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment);

        expect(getEventAsYamlSpy).toHaveBeenCalledTimes(1);

        expect(getEventAsYamlSpy).toHaveBeenCalledWith({
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
        });
        expect(data).toEqual(TEST_EVENT_YAML);
    });

    it("should redirect to the dataset overview without loading the event when the user may not commit", async () => {
        const getEventAsYamlSpy = stubMethod(editService, "getEventAsYaml");

        const data = await resolve(mockDatasetBasicsRootFragment, mockReadonlyDatasetPermissionsFragment);

        expectOverviewRedirect(data);
        expect(getEventAsYamlSpy).not.toHaveBeenCalled();
    });

    it("should redirect to the dataset overview without loading the event for a dataset of another kind", async () => {
        const getEventAsYamlSpy = stubMethod(editService, "getEventAsYaml");

        const data = await resolve(mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment);

        expectOverviewRedirect(data);
        expect(getEventAsYamlSpy).not.toHaveBeenCalled();
    });
});
