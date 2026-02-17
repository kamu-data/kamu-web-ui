/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

import { DataHelpers } from "@common/helpers/data.helpers";
import AppValues from "@common/values/app.values";
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { MetadataBlockFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import ProjectLinks from "src/app/project-links";

import { FeatureFlagDirective } from "../../directives/feature-flag.directive";
import { DisplayHashComponent } from "../display-hash/display-hash.component";
import { DisplayTimeComponent } from "../display-time/display-time.component";

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
