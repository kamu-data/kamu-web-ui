/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

import { CliProtocolDesc } from "@api/kamu.graphql.interface";

import { CopyToClipboardComponent } from "../../../../common/components/copy-to-clipboard/copy-to-clipboard.component";

@Component({
    selector: "app-data-access-kamu-cli-tab",
    templateUrl: "./data-access-kamu-cli-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        MatDividerModule,
        MatIconModule,
        //-----//
        CopyToClipboardComponent,
    ],
})
export class DataAccessKamuCliTabComponent {
    @Input({ required: true }) public cli: CliProtocolDesc;
}
