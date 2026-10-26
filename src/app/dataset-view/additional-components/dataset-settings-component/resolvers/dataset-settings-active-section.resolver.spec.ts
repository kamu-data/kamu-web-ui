/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";

import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { datasetSettingsActiveSectionResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/resolvers/dataset-settings-active-section.resolver";
import ProjectLinks from "src/app/project-links";

describe("datasetSettingsActiveSectionResolverFn", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should check resolver", async () => {
        const route = routeSnapshot({
            children: [routeSnapshot({ data: { [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.ACCESS } })],
        });

        const result = await runResolver(datasetSettingsActiveSectionResolverFn, route);

        expect(result).toEqual(SettingsTabsEnum.ACCESS);
    });
});
