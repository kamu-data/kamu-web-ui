/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DestroyRef, inject, Injectable } from "@angular/core";

@Injectable()
export class UnsubscribeDestroyRefAdapter {
    protected destroyRef = inject(DestroyRef);
}
