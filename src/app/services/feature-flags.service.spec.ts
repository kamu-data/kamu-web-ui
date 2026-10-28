/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import {
    Feature,
    FeatureDevelopmentState,
    FeatureShowMode,
    FeatureVisibility,
} from "@interface/feature-flags.interface";

import { AppConfigService } from "src/app/app-config.service";
import { FeatureFlagsService } from "src/app/services/feature-flags.service";

describe("FeatureFlagsService", () => {
    let service: FeatureFlagsService;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(FeatureFlagsService);
        appConfigService = TestBed.inject(AppConfigService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check #getEffectiveFeatureShowMode method", () => {
        vi.spyOn(appConfigService, "featuresRuntimeConfig", "get").mockReturnValue({
            showMode: FeatureShowMode.DEVELOP,
        });
        expect(service.getEffectiveFeatureShowMode()).toEqual(FeatureShowMode.DEVELOP);
    });

    it("should check #getEffectiveFeatureShowMode method with null", () => {
        vi.spyOn(appConfigService, "featuresRuntimeConfig", "get").mockReturnValue(null);
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

    describe("#featureVisibility", () => {
        beforeEach(() => {
            service.features = [
                { id: "stable", developmentState: FeatureDevelopmentState.STABLE, subfeatures: undefined },
                { id: "mockup", developmentState: FeatureDevelopmentState.MOCKUP, subfeatures: undefined },
                { id: "reserved", developmentState: FeatureDevelopmentState.RESERVED, subfeatures: undefined },
            ];
        });

        [
            {
                showMode: FeatureShowMode.PRODUCTION,
                expected: [FeatureVisibility.VISIBLE, FeatureVisibility.INVISIBLE, FeatureVisibility.INVISIBLE],
            },
            {
                showMode: FeatureShowMode.DEMO,
                expected: [FeatureVisibility.VISIBLE, FeatureVisibility.DISABLED, FeatureVisibility.DISABLED],
            },
            {
                showMode: FeatureShowMode.DEVELOP,
                expected: [FeatureVisibility.VISIBLE, FeatureVisibility.VISIBLE, FeatureVisibility.VISIBLE],
            },
        ].forEach(({ showMode, expected }) => {
            it(`should show stable, mockup and reserved features in ${showMode} mode as ${expected.join(", ")}`, () => {
                vi.spyOn(appConfigService, "featuresRuntimeConfig", "get").mockReturnValue({ showMode });

                expect(["stable", "mockup", "reserved"].map((name) => service.featureVisibility(name))).toEqual(
                    expected,
                );
            });
        });

        it("should hide a feature missing from the list", () => {
            vi.spyOn(appConfigService, "featuresRuntimeConfig", "get").mockReturnValue({
                showMode: FeatureShowMode.DEVELOP,
            });

            expect(service.featureVisibility("unknown")).toEqual(FeatureVisibility.INVISIBLE);
        });
    });
});
