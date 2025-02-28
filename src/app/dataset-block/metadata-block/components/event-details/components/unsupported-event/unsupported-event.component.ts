/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BaseComponent } from "src/app/common/components/base.component";

@Component({
    selector: "app-unsupported-event",
    templateUrl: "./unsupported-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsupportedEventComponent extends BaseComponent {}
