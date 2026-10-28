/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Directive, ElementRef, inject, Input, Renderer2 } from "@angular/core";

import { FeatureVisibility } from "@interface/feature-flags.interface";

import { FeatureFlagsService } from "src/app/services/feature-flags.service";

@Directive({
    selector: "[appFeatureFlag]",
})
export class FeatureFlagDirective {
    private el = inject<ElementRef<HTMLElement>>(ElementRef);
    private renderer = inject(Renderer2);
    private featureFlagsService = inject(FeatureFlagsService);

    @Input("appFeatureFlag") public featureName: string;

    public ngOnInit(): void {
        switch (this.featureFlagsService.featureVisibility(this.featureName)) {
            case FeatureVisibility.VISIBLE:
                break;
            case FeatureVisibility.DISABLED:
                this.renderer.addClass(this.el.nativeElement, "disabled");
                break;
            case FeatureVisibility.INVISIBLE:
                this.renderer.setStyle(this.el.nativeElement, "display", "none");
                break;
        }
    }
}
