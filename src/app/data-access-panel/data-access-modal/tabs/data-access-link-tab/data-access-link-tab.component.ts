/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { LinkProtocolDesc } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-data-access-link-tab",
    templateUrl: "./data-access-link-tab.component.html",
    styleUrls: ["./data-access-link-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessLinkTabComponent {
    @Input({ required: true }) public webLink: LinkProtocolDesc;
}
