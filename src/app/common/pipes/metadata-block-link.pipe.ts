/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Pipe, PipeTransform } from "@angular/core";
import { UrlTree } from "@angular/router";

import { MetadataBlockNavigationParams } from "@interface/navigation.interface";

import { NavigationService } from "src/app/services/navigation.service";

/** Link to a metadata block page, built by `NavigationService.metadataBlockUrlTree`. */
@Pipe({
    name: "metadataBlockLink",
})
export class MetadataBlockLinkPipe implements PipeTransform {
    private navigationService = inject(NavigationService);

    public transform(params: MetadataBlockNavigationParams): UrlTree {
        return this.navigationService.metadataBlockUrlTree(params);
    }
}
