/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { OdataProtocolDesc } from "src/app/api/kamu.graphql.interface";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { CopyToClipboardComponent } from "../../../../common/components/copy-to-clipboard/copy-to-clipboard.component";

@Component({
    selector: "app-data-access-odata-tab",
    templateUrl: "./data-access-odata-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        MatDividerModule,
        MatIconModule,
        //-----//
        CopyToClipboardComponent,
    ],
})
export class DataAccessOdataTabComponent {
    @Input({ required: true }) public odata: OdataProtocolDesc;
}
