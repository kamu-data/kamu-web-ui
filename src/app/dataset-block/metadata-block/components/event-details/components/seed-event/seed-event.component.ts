/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ToastrService } from "ngx-toastr";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { Seed } from "src/app/api/kamu.graphql.interface";
import { Clipboard } from "@angular/cdk/clipboard";
import { BaseComponent } from "src/app/common/components/base.component";
import { TitleCasePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";

@Component({
    selector: "app-seed-event",
    templateUrl: "./seed-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        TitleCasePipe,
        //-----//
        MatIconModule,
        //-----//
        BlockRowDataComponent,
    ],
})
export class SeedEventComponent extends BaseComponent {
    @Input({ required: true }) public event: Seed;

    private clipboard = inject(Clipboard);
    private toastService = inject(ToastrService);

    public copyToClipboard(text: string): void {
        this.clipboard.copy(text);
        this.toastService.success("Copied");
    }
}
