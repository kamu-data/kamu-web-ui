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

@Component({
    selector: "app-dataset-list-item",
    templateUrl: "./dataset-list-item.component.html",
    styleUrls: ["./dataset-list-item.component.scss"],
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
