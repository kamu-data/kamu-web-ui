/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { RestProtocolDesc } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-data-access-rest-tab",
    templateUrl: "./data-access-rest-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessRestTabComponent {
    @Input({ required: true }) public rest: RestProtocolDesc;
}
