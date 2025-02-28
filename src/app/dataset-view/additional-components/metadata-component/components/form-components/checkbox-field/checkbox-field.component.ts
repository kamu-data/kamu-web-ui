/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseField } from "../base-field";

@Component({
    selector: "app-checkbox-field",
    templateUrl: "./checkbox-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFieldComponent extends BaseField {
    @Input({ required: true }) public checked: boolean;
}
