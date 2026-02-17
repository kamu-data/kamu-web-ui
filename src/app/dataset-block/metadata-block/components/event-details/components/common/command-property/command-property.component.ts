/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-command-property",
    templateUrl: "./command-property.component.html",
    styleUrls: ["./command-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class CommandPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string[];

    public get commands(): string {
        return this.data.join(" ");
    }
}
