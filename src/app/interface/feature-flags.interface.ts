/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeUndefined } from "@interface/app.types";

export interface Feature {
    id: string;
    developmentState: FeatureDevelopmentState;
    subfeatures: MaybeUndefined<Feature[]>;
}

export enum FeatureDevelopmentState {
    STABLE = "stable",
    MOCKUP = "mockup",
    RESERVED = "reserved",
}

export enum FeatureShowMode {
    // Mockups and Reserved features hidden
    PRODUCTION = "production",
    // Mockups and Reserved are shown as disabled
    DEMO = "demo",
    // Everything is enabled, even if it does not work
    DEVELOP = "develop",
}

export enum FeatureVisibility {
    VISIBLE = "visible",
    DISABLED = "disabled",
    INVISIBLE = "invisible",
}
