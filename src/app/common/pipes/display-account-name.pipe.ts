/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";
import { AccountProvider } from "src/app/api/kamu.graphql.interface";

@Pipe({
    name: "displayAccountName",
})
export class DisplayAccountNamePipe implements PipeTransform {
    public transform(name: string, provider: AccountProvider): string {
        if (provider === AccountProvider.Web3Wallet) {
            return name.slice(0, 6) + "..." + name.slice(-4);
        }
        return name;
    }
}
