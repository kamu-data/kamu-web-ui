/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CdkAccordionModule } from "@angular/cdk/accordion";
import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import DataTabValues from "src/app/dataset-view/additional-components/data-component/mock.data";

@Component({
    selector: "app-saved-queries-section",
    templateUrl: "./saved-queries-section.component.html",
    styleUrls: ["./saved-queries-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgFor,
        NgIf,
        //-----//
        CdkAccordionModule,
        MatIconModule,
        MatButtonModule,
    ],
})
export class SavedQueriesSectionComponent {
    public savedQueries = DataTabValues.savedQueries;
}
