/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { SearchAdditionalButtonsComponent } from "./search-additional-buttons.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { SearchAdditionalButtonsNavComponent } from "./search-additional-buttons-nav.component";
import { FeatureFlagModule } from "../../directives/feature-flag.module";

@NgModule({
    imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule, NgbPopoverModule, FeatureFlagModule],
    exports: [SearchAdditionalButtonsComponent, SearchAdditionalButtonsNavComponent],
    declarations: [SearchAdditionalButtonsComponent, SearchAdditionalButtonsNavComponent],
})
export class SearchAdditionalButtonsModule {}
