import { MaybeUndefined } from "../common/types/app.types";

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
