/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Directive, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { BaseComponent } from "@common/components/base.component";

@Directive()
export abstract class BaseField extends BaseComponent {
    @Input({ required: true }) public form: FormGroup;
    @Input({ required: true }) public controlName: string;
    @Input({ required: true }) public label: string;
    @Input({ required: true }) public tooltip: string;
    @Input() public dataTestId?: string;
}
