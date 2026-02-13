/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MetadataBlockFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import AppValues from "src/app/common/values/app.values";
import ProjectLinks from "src/app/project-links";
import { DisplayHashComponent } from "../display-hash/display-hash.component";
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { FeatureFlagDirective } from "../../directives/feature-flag.directive";
import { DisplayTimeComponent } from "../display-time/display-time.component";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { NgFor } from "@angular/common";

@Component({
    selector: "app-timeline",
    templateUrl: "./timeline.component.html",
    styleUrls: ["timeline.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgFor,
        RouterLink,
        //-----//
        MatIconModule,
        NgbPopover,
        //-----//
        DisplayTimeComponent,
        DisplayHashComponent,
        FeatureFlagDirective,
    ],
})
export class TimelineComponent {
    @Input({ required: true }) public history: MetadataBlockFragment[];
    @Input({ required: true }) public pageInfo: PageBasedInfo;
    @Input({ required: true }) public datasetName: string;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly URL_BLOCK = ProjectLinks.URL_BLOCK;

    public descriptionForMetadataBlock(block: MetadataBlockFragment): string {
        return DataHelpers.descriptionForMetadataBlock(block);
    }

    public setTimelineItemIcon(block: MetadataBlockFragment): string {
        return DataHelpers.setTimelineItemIcon(block);
    }
}
