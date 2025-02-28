/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { FeatureFlagsService } from "./feature-flags.service";
import { AppConfigService } from "../app-config.service";
import { Feature, FeatureDevelopmentState, FeatureShowMode } from "../interface/feature-flags.interface";

describe("FeatureFlagsService", () => {
    let service: FeatureFlagsService;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(FeatureFlagsService);
        appConfigService = TestBed.inject(AppConfigService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check #getEffectiveFeatureShowMode method", () => {
        spyOnProperty(appConfigService, "featuresRuntimeConfig", "get").and.returnValue({
            showMode: FeatureShowMode.DEVELOP,
        });
        expect(service.getEffectiveFeatureShowMode()).toEqual(FeatureShowMode.DEVELOP);
    });

    it("should check #getEffectiveFeatureShowMode method with null", () => {
        spyOnProperty(appConfigService, "featuresRuntimeConfig", "get").and.returnValue(null);
        expect(service.getEffectiveFeatureShowMode()).toEqual(FeatureShowMode.PRODUCTION);
    });

    it("should check #findFeature method return null", () => {
        expect(service.findFeature("unknownFeatureName")).toEqual(null);
    });

    it("should check #resolveFeature method with features equal []", () => {
        service.features = [];
        expect(service.findFeature("dataset.badgePrivacy")).toEqual(null);
    });

    it("should check #resolveFeature method with features ", () => {
        const mockFeature: Feature = {
            id: "dataset",
            developmentState: FeatureDevelopmentState.STABLE,
            subfeatures: undefined,
        };
        service.features = [mockFeature];
        expect(service.findFeature("dataset")).toEqual(mockFeature);
    });

    it("should check #resolveFeature method with subfeatures ", () => {
        const subFeature: Feature = {
            id: "badgePrivacy",
            developmentState: FeatureDevelopmentState.STABLE,
            subfeatures: undefined,
        };
        const mockFeature: Feature = {
            id: "dataset",
            developmentState: FeatureDevelopmentState.STABLE,
            subfeatures: [subFeature],
        };
        service.features = [mockFeature];
        expect(service.findFeature("dataset.badgePrivacy")).toEqual(subFeature);
    });
});
