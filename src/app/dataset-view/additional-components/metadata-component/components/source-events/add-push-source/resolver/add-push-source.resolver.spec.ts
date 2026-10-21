/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { firstValueFrom, Observable, of } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect } from "@common/helpers/base-test.helpers.spec";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";
import { MaybeNull, MaybeNullOrUndefined } from "@interface/app.types";

import { EditAddPushSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/edit-add-push-source.service";
import { addPushSourceResolverFn } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/resolver/add-push-source.resolver";
import ProjectLinks from "src/app/project-links";

describe("addPushSourceResolverFn", () => {
    let editService: EditAddPushSourceService;
    let getEventAsYamlSpy: jasmine.Spy;
    const TEST_SOURCE_NAME = "my-source";
    const TEST_EVENT_YAML = "kind: AddPushSource";

    const mockState = {} as RouterStateSnapshot;

    const executeResolver: ResolveFn<MaybeNull<string>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => addPushSourceResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        editService = TestBed.inject(EditAddPushSourceService);
    });

    function createRoute(sourceName?: string): ActivatedRouteSnapshot {
        return {
            paramMap: convertToParamMap({
                [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
            }),
            queryParamMap: convertToParamMap(
                sourceName ? { [ProjectLinks.URL_QUERY_PARAM_PUSH_SOURCE_NAME]: sourceName } : {},
            ),
        } as ActivatedRouteSnapshot;
    }

    function resolve(route: ActivatedRouteSnapshot, eventYaml: MaybeNullOrUndefined<string>): Promise<unknown> {
        getEventAsYamlSpy = spyOn(editService, "getEventAsYaml").and.returnValue(of(eventYaml));
        return firstValueFrom(executeResolver(route, mockState) as Observable<unknown>);
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
});
