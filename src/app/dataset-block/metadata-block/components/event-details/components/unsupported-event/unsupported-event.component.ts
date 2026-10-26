/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { BaseComponent } from "@common/components/base.component";
import { MetadataEventDataFragment } from "@api/kamu.graphql.interface";

@Component({
    selector: "app-unsupported-event",
    templateUrl: "./unsupported-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        MatIconModule,
    ],
})
export class UnsupportedEventComponent extends BaseComponent {
    @Input() public event?: MetadataEventDataFragment;
}
