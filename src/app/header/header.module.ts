/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppHeaderComponent } from "./app-header/app-header.component";
import { NotificationIndicatorComponent } from "./notification-indicator/notification-indicator.component";
import { RouterModule } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { HighlightModule } from "ngx-highlightjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { FeatureFlagModule } from "../common/directives/feature-flag.module";
import { DisplayAccountNameModule } from "../common/pipes/display-account-name.module";

@NgModule({
    declarations: [AppHeaderComponent, NotificationIndicatorComponent],
    exports: [AppHeaderComponent],
    imports: [
        CommonModule,
        FeatureFlagModule,
        FormsModule,
        HighlightModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule,
        NgbTypeaheadModule,
        RouterModule,
        DisplayAccountNameModule,
    ],
})
export class HeaderModule {}
