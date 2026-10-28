/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { featureFlagGuard } from "@common/guards/feature-flag.guard";
import { expectPageNotFoundRedirect, runCanActivate } from "@common/helpers/base-test.helpers.spec";
import { FeatureVisibility } from "@interface/feature-flags.interface";

import { FeatureFlagsService } from "src/app/services/feature-flags.service";

describe("featureFlagGuard", () => {
    let featureFlagsService: FeatureFlagsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        featureFlagsService = TestBed.inject(FeatureFlagsService);
    });

    it("opens the route when its feature is visible", async () => {
        const visibilitySpy = vi
            .spyOn(featureFlagsService, "featureVisibility")
            .mockReturnValue(FeatureVisibility.VISIBLE);

        expect(await runCanActivate(featureFlagGuard("flowDetails.usage"))).toBe(true);
        expect(visibilitySpy).toHaveBeenCalledWith("flowDetails.usage");
    });

    [FeatureVisibility.DISABLED, FeatureVisibility.INVISIBLE].forEach((visibility) => {
        it(`shows page-not-found when its feature is ${visibility}`, async () => {
            vi.spyOn(featureFlagsService, "featureVisibility").mockReturnValue(visibility);

            expectPageNotFoundRedirect(await runCanActivate(featureFlagGuard("flowDetails.usage")));
        });
    });
});
