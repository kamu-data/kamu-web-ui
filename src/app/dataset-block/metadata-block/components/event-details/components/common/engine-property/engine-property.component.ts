/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-engine-property",
    templateUrl: "./engine-property.component.html",
    styleUrls: ["./engine-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnginePropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;

    public get engineLogo(): string | undefined {
        return DataHelpers.descriptionForEngine(this.data).url_logo;
    }

    public get engineDescription(): string {
        const engineDesc = DataHelpers.descriptionForEngine(this.data);
        if (engineDesc.label && engineDesc.label.toLowerCase() != engineDesc.name.toLowerCase()) {
            return `${engineDesc.label} (${engineDesc.name})`;
        } else {
            return engineDesc.name;
        }
    }
}
