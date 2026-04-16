/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import { DefaultUrlSerializer, UrlTree } from "@angular/router";

import { maskDotsInURL } from "./app.helpers";

@Injectable()
export class KamuUrlSerializer extends DefaultUrlSerializer {
    public override serialize(tree: UrlTree): string {
        const url = super.serialize(tree);
        return maskDotsInURL(url, 2);
    }
}
