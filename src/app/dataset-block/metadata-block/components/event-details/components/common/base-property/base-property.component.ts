/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Directive, Input } from "@angular/core";

import { BaseComponent } from "@common/components/base.component";

@Directive()
export abstract class BasePropertyComponent extends BaseComponent {
    @Input() public dataTestId?: string;
}
