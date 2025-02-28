/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SetInfo } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";

@Component({
    selector: "app-set-info-event",
    templateUrl: "./set-info-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetInfoEventComponent extends BaseComponent {
    @Input({ required: true }) public event: SetInfo;
}
