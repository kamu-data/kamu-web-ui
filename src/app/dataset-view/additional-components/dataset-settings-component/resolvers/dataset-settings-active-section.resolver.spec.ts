/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { datasetSettingsActiveSectionResolverFn } from "./dataset-settings-active-section.resolver";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import ProjectLinks from "src/app/project-links";

describe("datasetSettingsActiveSectionResolverFn", () => {
    const executeResolver: ResolveFn<SettingsTabsEnum> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsActiveSectionResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", async () => {
        const mockRoute = {
            children: [
                {
                    data: {
                        [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.ACCESS,
                    },
                },
            ],
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;
        const result = await executeResolver(mockRoute, mockState);

        expect(result).toEqual(SettingsTabsEnum.ACCESS);
    });
});
