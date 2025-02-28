/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Observable } from "rxjs";
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetHistoryUpdate } from "../../dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { MaybeNull } from "src/app/interface/app.types";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent extends BaseComponent {
    private datasetSubsService = inject(DatasetSubscriptionsService);

    @Input({ required: true }) public datasetName: string;
    @Output() public onPageChangeEmit = new EventEmitter<number>();
    public historyUpdate$: Observable<MaybeNull<DatasetHistoryUpdate>> = this.datasetSubsService.historyChanges;

    public onPageChange(currentPage: number): void {
        this.onPageChangeEmit.emit(currentPage);
    }
}
