/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BaseComponent } from "src/app/common/components/base.component";
import { SetAttachments } from "../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MarkdownModule } from "ngx-markdown";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { NgFor } from "@angular/common";

@Component({
    selector: "app-set-attachments-event",
    templateUrl: "./set-attachments-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgFor,

        //-----//
        MarkdownModule,

        //-----//
        BlockRowDataComponent,
    ],
})
export class SetAttachmentsEventComponent extends BaseComponent {
    @Input({ required: true }) public event: SetAttachments;
}
