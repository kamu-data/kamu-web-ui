/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BaseComponent } from "@common/components/base.component";
import { MarkdownModule } from "ngx-markdown";

import { SetAttachments } from "../../../../../../api/kamu.graphql.interface";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";

@Component({
    selector: "app-set-attachments-event",
    templateUrl: "./set-attachments-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
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
