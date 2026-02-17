/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor, NgIf } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

import { NgbPopover, NgbRating } from "@ng-bootstrap/ng-bootstrap";
import { DatasetKind, DatasetSearchOverviewFragment } from "src/app/api/kamu.graphql.interface";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import AppValues from "src/app/common/values/app.values";
import { NavigationService } from "src/app/services/navigation.service";

import { FeatureFlagDirective } from "../../../directives/feature-flag.directive";
import { DatasetKindComponent } from "../../dataset-kind/dataset-kind.component";
import { DatasetVisibilityComponent } from "../../dataset-visibility/dataset-visibility.component";
import { DisplayTimeComponent } from "../../display-time/display-time.component";
import { ModalService } from "../../modal/modal.service";

@Component({
    selector: "app-dataset-list-item",
    templateUrl: "./dataset-list-item.component.html",
    styleUrls: ["./dataset-list-item.component.scss"],
    imports: [
        //-----//
        NgFor,
        NgIf,
        RouterLink,
        //-----//
        MatChipsModule,
        MatIconModule,
        MatDividerModule,
        NgbPopover,
        NgbRating,
        //-----//
        DatasetVisibilityComponent,
        DatasetKindComponent,
        DisplayTimeComponent,
        FeatureFlagDirective,
    ],
})
export class DatasetListItemComponent {
    @Input({ required: true }) public row: DatasetSearchOverviewFragment;
    @Input({ required: true }) public isClickableRow: boolean;
    @Input({ required: true }) public rowIndex: number;

    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;

    private modalService = inject(ModalService);
    private navigationService = inject(NavigationService);

    public get isRoot(): boolean {
        return this.row.kind === DatasetKind.Root;
    }

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
