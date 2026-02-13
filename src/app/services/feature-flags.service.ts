/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Feature, FeatureShowMode } from "src/app/interface/feature-flags.interface";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { AppConfigService } from "../app-config.service";

@Injectable({
    providedIn: "root",
})
export class FeatureFlagsService {
    public features: Feature[];

    public constructor(private appConfigService: AppConfigService) {
        const request = new XMLHttpRequest();
        request.open("GET", environment.feature_flags_file, false);
        request.send(null);
        this.features = JSON.parse(request.responseText) as Feature[];
    }

    public getEffectiveFeatureShowMode(): FeatureShowMode {
        return this.appConfigService.featuresRuntimeConfig?.showMode || FeatureShowMode.PRODUCTION;
    }

    public findFeature(name: string): MaybeNull<Feature> {
        const nameParts = name.split(".");
        return FeatureFlagsService.resolveFeature(nameParts, this.features);
    }

    private static resolveFeature(nameParts: string[], features: Feature[]): MaybeNull<Feature> {
        if (nameParts.length == 0 || features.length == 0) {
            return null;
        }

        const maybeFeature: MaybeUndefined<Feature> = features.find((f) => f.id == nameParts[0]);
        if (maybeFeature) {
            if (nameParts.length > 1) {
                if (maybeFeature.subfeatures) {
                    return FeatureFlagsService.resolveFeature(nameParts.slice(1), maybeFeature.subfeatures);
                } else {
                    return null;
                }
            } else {
                return maybeFeature;
            }
        } else {
            return null;
        }
    }
}
