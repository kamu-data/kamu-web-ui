/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";

import { snapshotParamMapMock } from "@common/helpers/base-test.helpers.spec";

@NgModule({
    providers: [snapshotParamMapMock],
})
export class SharedTestModule {}
