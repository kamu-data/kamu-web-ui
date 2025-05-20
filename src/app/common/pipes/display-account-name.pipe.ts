/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "displayAccountName",
})
export class DisplayAccountNamePipe implements PipeTransform {
    public transform(name: string): string {
        if (name.startsWith("0x")) {
            return name.slice(0, 6) + "..." + name.slice(-4);
        }
        return name;
    }
}
