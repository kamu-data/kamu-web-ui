/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ModalService } from "../../modal/modal.service";
import { Component, inject, Input } from "@angular/core";
import { DatasetSearchOverviewFragment } from "src/app/api/kamu.graphql.interface";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { NavigationService } from "src/app/services/navigation.service";
import { MatDividerModule } from "@angular/material/divider";
import { DisplayTimeComponent } from "../../display-time/display-time.component";
import { MatChipsModule } from "@angular/material/chips";
import { NgbPopover, NgbRating } from "@ng-bootstrap/ng-bootstrap";
import { FeatureFlagDirective } from "../../../directives/feature-flag.directive";
import { DatasetVisibilityComponent } from "../../dataset-visibility/dataset-visibility.component";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { NgIf, NgFor } from "@angular/common";

@Component({
    selector: "app-dataset-list-item",
    templateUrl: "./dataset-list-item.component.html",
    styleUrls: ["./dataset-list-item.component.scss"],
    standalone: true,
    imports: [
        NgIf,
        MatIconModule,
        RouterLink,
        DatasetVisibilityComponent,
        FeatureFlagDirective,
        NgbPopover,
        MatChipsModule,
        NgFor,
        DisplayTimeComponent,
        NgbRating,
        MatDividerModule,
    ],
})
export class DatasetListItemComponent {
    @Input({ required: true }) public row: DatasetSearchOverviewFragment;
    @Input({ required: true }) public isClickableRow: boolean;
    @Input({ required: true }) public rowIndex: number;

    private modalService = inject(ModalService);
    private navigationService = inject(NavigationService);

    public selectTopic(topicName: string): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
                title: topicName,
            }),
        );
    }

    public navigateToOwnerView(ownerName: string): void {
        this.navigationService.navigateToOwnerView(ownerName);
    }
}
