/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Pipe, PipeTransform } from "@angular/core";
import { UrlTree } from "@angular/router";

import { WebhooksNavigationParams } from "@interface/navigation.interface";

import { NavigationService } from "src/app/services/navigation.service";

/** Link to a dataset webhooks page, built by `NavigationService.webhooksUrlTree`. */
@Pipe({
    name: "webhooksLink",
})
export class WebhooksLinkPipe implements PipeTransform {
    private navigationService = inject(NavigationService);

    public transform(params: WebhooksNavigationParams): UrlTree {
        return this.navigationService.webhooksUrlTree(params);
    }
}
