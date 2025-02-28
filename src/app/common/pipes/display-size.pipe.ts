/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "displaySize",
})
export class DisplaySizePipe implements PipeTransform {
    public transform(value: number, decimalPlaces = 1): string {
        return this.dataSize(value, decimalPlaces);
    }

    private dataSize(bytes: number, decimalPlaces: number): string {
        const thresh = 1024;

        if (Math.abs(bytes) < thresh) {
            return `${bytes} B`;
        }

        const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let u = -1;
        const r = 10 ** decimalPlaces;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

        return bytes.toFixed(decimalPlaces) + " " + units[u];
    }
}
