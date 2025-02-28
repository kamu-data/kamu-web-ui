/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
    selector: "app-source-name-step",
    templateUrl: "./source-name-step.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceNameStepComponent {
    @Input({ required: true }) public form: FormGroup;
}
