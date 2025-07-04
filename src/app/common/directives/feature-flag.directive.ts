/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Directive, ElementRef, inject, Input, Renderer2 } from "@angular/core";
import {
    Feature,
    FeatureDevelopmentState,
    FeatureShowMode,
    FeatureVisibility,
} from "src/app/interface/feature-flags.interface";
import { FeatureFlagsService } from "src/app/services/feature-flags.service";

@Directive({
    selector: "[appFeatureFlag]",
    standalone: true,
})
export class FeatureFlagDirective {
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);
    private featureFlagsService = inject(FeatureFlagsService);

    @Input("appFeatureFlag") public featureName: string;

    public ngOnInit(): void {
        if (!this.el.nativeElement) {
            return;
        }
        const maybeFeature = this.featureFlagsService.findFeature(this.featureName);
        if (maybeFeature) {
            const visibility = this.deduceFeatureVisibility(maybeFeature);
            switch (visibility) {
                case FeatureVisibility.VISIBLE:
                    break;
                case FeatureVisibility.DISABLED:
                    this.renderer.addClass(this.el.nativeElement, "disabled");
                    break;
                case FeatureVisibility.INVISIBLE:
                    this.renderer.setStyle(this.el.nativeElement, "display", "none");
                    break;
            }
        } else {
            this.renderer.setStyle(this.el.nativeElement, "display", "none");
        }
    }

    private deduceFeatureVisibility(feature: Feature): FeatureVisibility {
        const showMode = this.featureFlagsService.getEffectiveFeatureShowMode();
        switch (showMode) {
            case FeatureShowMode.PRODUCTION:
                switch (feature.developmentState) {
                    case FeatureDevelopmentState.STABLE:
                        return FeatureVisibility.VISIBLE;
                    case FeatureDevelopmentState.MOCKUP:
                    case FeatureDevelopmentState.RESERVED:
                        return FeatureVisibility.INVISIBLE;
                }
                break;

            case FeatureShowMode.DEMO:
                {
                    switch (feature.developmentState) {
                        case FeatureDevelopmentState.STABLE:
                            return FeatureVisibility.VISIBLE;
                        case FeatureDevelopmentState.MOCKUP:
                            return FeatureVisibility.DISABLED;
                        case FeatureDevelopmentState.RESERVED:
                            return FeatureVisibility.DISABLED;
                    }
                }
                break;

            case FeatureShowMode.DEVELOP:
                return FeatureVisibility.VISIBLE;
        }
    }
}
