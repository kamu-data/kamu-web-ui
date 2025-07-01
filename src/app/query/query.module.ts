/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CommonModule } from "@angular/common";
import { GlobalQueryComponent } from "./global-query/global-query.component";
import { QuerySharedModule } from "./shared/query-shared.module";
import { NgModule } from "@angular/core";

@NgModule({
    imports: [
        //-----//
        CommonModule,

        //-----//
        GlobalQueryComponent,
        QuerySharedModule,
    ],
})
export class QueryModule {}
