/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BaseComponent } from "src/app/common/components/base.component";
import { MetadataBlockFragment } from "../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DisplayHashComponent } from "../../../../common/components/display-hash/display-hash.component";
import { DisplayTimeComponent } from "../../../../common/components/display-time/display-time.component";
import { BlockRowDataComponent } from "../../../../common/components/block-row-data/block-row-data.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FeatureFlagDirective } from "../../../../common/directives/feature-flag.directive";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-block-header",
    templateUrl: "./block-header.component.html",
    styleUrls: ["./block-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        FeatureFlagDirective,
        MatMenuModule,
        MatIconModule,
        MatDividerModule,
        BlockRowDataComponent,
        DisplayTimeComponent,
        DisplayHashComponent,
    ],
})
export class BlockHeaderComponent extends BaseComponent {
    @Input({ required: true }) public datasetInfo: DatasetInfo;
    @Input({ required: true }) public block: MetadataBlockFragment;
}
