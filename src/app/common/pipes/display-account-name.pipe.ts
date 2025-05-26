/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";
import AppValues from "../values/app.values";

@Pipe({
    name: "displayAccountName",
})
export class DisplayAccountNamePipe implements PipeTransform {
    private readonly WEB3_WALLET_PROVIDER = AppValues.ACCOUNT_WEB3_WALLET_PROVIDER;

    public transform(name: string, provider: string): string {
        if (provider === this.WEB3_WALLET_PROVIDER) {
            return name.slice(0, 6) + "..." + name.slice(-4);
        }
        return name;
    }
}
