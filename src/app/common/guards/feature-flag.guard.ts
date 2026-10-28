/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";

import { FeatureVisibility } from "@interface/feature-flags.interface";

import { FeatureFlagsService } from "src/app/services/feature-flags.service";
import { NavigationService } from "src/app/services/navigation.service";

/** A guard that opens the route only when the UI shows its feature as enabled, as `appFeatureFlag` does for its link */
export function featureFlagGuard(featureName: string): CanActivateFn {
    return () => {
        const featureFlagsService = inject(FeatureFlagsService);
        const navigationService = inject(NavigationService);

        return (
            featureFlagsService.featureVisibility(featureName) === FeatureVisibility.VISIBLE ||
            navigationService.pageNotFoundRedirect()
        );
    };
}
