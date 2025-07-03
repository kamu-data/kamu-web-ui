/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { LinkProtocolDesc } from "src/app/api/kamu.graphql.interface";
import { MatDividerModule } from "@angular/material/divider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FeatureFlagDirective } from "../../../../common/directives/feature-flag.directive";
import { CopyToClipboardComponent } from "../../../../common/components/copy-to-clipboard/copy-to-clipboard.component";

@Component({
    selector: "app-data-access-link-tab",
    templateUrl: "./data-access-link-tab.component.html",
    styleUrls: ["./data-access-link-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        MatCheckboxModule,
        MatIconModule,
        MatTooltipModule,
        MatDividerModule,

        //-----//
        CopyToClipboardComponent,
        FeatureFlagDirective,
    ],
})
export class DataAccessLinkTabComponent {
    @Input({ required: true }) public webLink: LinkProtocolDesc;
}
