/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";

import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { metadataActiveTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/resolver/metadata-active-tab.resolver";
import ProjectLinks from "src/app/project-links";

describe("metadataActiveTabResolver", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should check to resolve an active tab", async () => {
        const route = routeSnapshot({
            children: [routeSnapshot({ data: { [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.Schema } })],
        });
        const result = await runResolver(metadataActiveTabResolverFn, route);
        expect(result).toEqual(MetadataTabs.Schema);
    });
});
