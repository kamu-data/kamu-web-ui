/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Pipe, PipeTransform } from "@angular/core";
import { UrlTree } from "@angular/router";

import { FlowDetailsNavigationParams } from "@interface/navigation.interface";

import { NavigationService } from "src/app/services/navigation.service";

/** Link to a flow details tab, built by `NavigationService.flowDetailsUrlTree`. */
@Pipe({
    name: "flowDetailsLink",
})
export class FlowDetailsLinkPipe implements PipeTransform {
    private navigationService = inject(NavigationService);

    public transform(params: FlowDetailsNavigationParams): UrlTree {
        return this.navigationService.flowDetailsUrlTree(params);
    }
}
