/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { snapshotRedirectUrlMock } from "../helpers/base-test.helpers.spec";

@NgModule({
    providers: [snapshotRedirectUrlMock],
})
export class RedirectUrlTestModule {}
