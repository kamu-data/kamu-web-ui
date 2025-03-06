/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BaseComponent } from "src/app/common/components/base.component";
import { SetLicense } from "../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-set-license-event",
    templateUrl: "./set-license-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetLicenseEventComponent extends BaseComponent {
    @Input({ required: true }) public event: SetLicense;
}
