/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "displayDatasetId",
})
export class DisplayDatasetIdPipe implements PipeTransform {
    public transform(id: string): string {
        return id.slice(0, 11) + "..." + id.slice(-7);
    }
}
