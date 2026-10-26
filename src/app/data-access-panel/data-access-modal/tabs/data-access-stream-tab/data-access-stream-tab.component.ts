/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { CopyToClipboardComponent } from "@common/components/copy-to-clipboard/copy-to-clipboard.component";
import { KafkaProtocolDescDataFragment, WebSocketProtocolDescDataFragment } from "@api/kamu.graphql.interface";

@Component({
    selector: "app-data-access-stream-tab",
    templateUrl: "./data-access-stream-tab.component.html",
    styleUrls: ["./data-access-stream-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        MatIconModule,
        //-----//
        CopyToClipboardComponent,
    ],
})
export class DataAccessStreamTabComponent {
    @Input({ required: true }) public kafka: KafkaProtocolDescDataFragment;
    @Input({ required: true }) public websocket: WebSocketProtocolDescDataFragment;
}
