/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-metadata-transformation-tab",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./metadata-transformation-tab.component.html",
    styleUrls: ["./metadata-transformation-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataTransformationTabComponent {}
