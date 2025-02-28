/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";

@NgModule({
    declarations: [AdminDashboardComponent],
    exports: [AdminDashboardComponent],
    imports: [CommonModule],
})
export class AdminViewModule {}
