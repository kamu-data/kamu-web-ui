/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Pipe, PipeTransform } from "@angular/core";
import { UrlTree } from "@angular/router";

import { DatasetNavigationParams } from "@interface/navigation.interface";

import { NavigationService } from "src/app/services/navigation.service";

/** Link to a dataset page, built by `NavigationService.datasetViewUrlTree`. */
@Pipe({
    name: "datasetLink",
})
export class DatasetLinkPipe implements PipeTransform {
    private navigationService = inject(NavigationService);

    public transform(params: DatasetNavigationParams): UrlTree {
        return this.navigationService.datasetViewUrlTree(params);
    }
}
