/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { metadataActiveTabResolverFn } from "./metadata-active-tab.resolver";
import { MetadataTabs } from "../metadata.constants";
import ProjectLinks from "src/app/project-links";

describe("metadataActiveTabResolver", () => {
    const executeResolver: ResolveFn<MetadataTabs> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => metadataActiveTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check to resolve an active tab", async () => {
        const routeSnapshot = {
            children: [
                {
                    data: {
                        [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.Schema,
                    },
                },
            ],
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;
        const result = await metadataActiveTabResolverFn(routeSnapshot, mockState);
        expect(result).toEqual(MetadataTabs.Schema);
    });
});
