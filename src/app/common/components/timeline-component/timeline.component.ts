/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";

import { DisplayHashComponent } from "@common/components/display-hash/display-hash.component";
import { DisplayTimeComponent } from "@common/components/display-time/display-time.component";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { DataHelpers } from "@common/helpers/data.helpers";
import { MetadataBlockLinkPipe } from "@common/pipes/metadata-block-link.pipe";
import AppValues from "@common/values/app.values";
import { DatasetPageInfoFragment, MetadataBlockFragment } from "@api/kamu.graphql.interface";

@Component({
    selector: "app-timeline",
    templateUrl: "./timeline.component.html",
    styleUrls: ["timeline.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        RouterLink,
        //-----//
        MatIconModule,
        NgbPopover,
        //-----//
        DisplayTimeComponent,
        DisplayHashComponent,
        FeatureFlagDirective,
        MetadataBlockLinkPipe,
    ],
})
export class TimelineComponent {
    @Input({ required: true }) public history: MetadataBlockFragment[];
    @Input({ required: true }) public pageInfo: DatasetPageInfoFragment;
    @Input({ required: true }) public datasetName: string;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;

    public descriptionForMetadataBlock(block: MetadataBlockFragment): string {
        return DataHelpers.descriptionForMetadataBlock(block);
    }

    public setTimelineItemIcon(block: MetadataBlockFragment): string {
        return DataHelpers.setTimelineItemIcon(block);
    }
}
