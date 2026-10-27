/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { isStringArray } from "@common/helpers/app.helpers";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";

@Component({
    selector: "app-command-property",
    templateUrl: "./command-property.component.html",
    styleUrls: ["./command-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string[];

    public static acceptsData(data: unknown): data is CommandPropertyComponent["data"] {
        return isStringArray(data);
    }

    public get commands(): string {
        return this.data.join(" ");
    }
}
