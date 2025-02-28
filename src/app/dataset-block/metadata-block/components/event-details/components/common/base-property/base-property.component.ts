/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BaseComponent } from "src/app/common/components/base.component";
import { Injectable, Input } from "@angular/core";

@Injectable()
export abstract class BasePropertyComponent extends BaseComponent {
    @Input() public dataTestId?: string;
}
