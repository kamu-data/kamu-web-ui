/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

import { DisplayHashComponent } from "@common/components/display-hash/display-hash.component";
import { DisplayTimeComponent } from "@common/components/display-time/display-time.component";
import { DataHelpers } from "@common/helpers/data.helpers";
import AppValues from "@common/values/app.values";
import { AccountBasicsFragment, AccountProvider, MetadataBlockFragment } from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-overview-history-summary-header",
    templateUrl: "./overview-history-summary-header.component.html",
    styleUrls: ["./overview-history-summary-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        RouterLink,
        //-----//
        MatIconModule,
        //-----//
        DisplayHashComponent,
        DisplayTimeComponent,
    ],
})
export class OverviewHistorySummaryHeaderComponent {
    @Input({ required: true }) public metadataBlockFragment: MaybeUndefined<MetadataBlockFragment>;
    @Input({ required: true }) public numBlocksTotal: number;
    @Input({ required: true }) public datasetName: string;

    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly URL_BLOCK = ProjectLinks.URL_BLOCK;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    public get systemTime(): string {
        return this.metadataBlockFragment ? this.metadataBlockFragment.systemTime : "";
    }

    public get authorInfo(): AccountBasicsFragment {
        return this.metadataBlockFragment?.author
            ? this.metadataBlockFragment.author
            : {
                  id: "",
                  accountName: AppValues.DEFAULT_USER_DISPLAY_NAME,
                  avatarUrl: AppValues.DEFAULT_AVATAR_URL,
                  accountProvider: AccountProvider.Password,
              };
    }

    public get descriptionForMetadataBlock(): string {
        return this.metadataBlockFragment ? DataHelpers.descriptionForMetadataBlock(this.metadataBlockFragment) : "";
    }
}
