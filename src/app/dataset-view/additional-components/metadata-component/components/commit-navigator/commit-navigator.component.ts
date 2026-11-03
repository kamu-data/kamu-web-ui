/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatePipe, SlicePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";

import { enumValueOf } from "@common/helpers/app.helpers";
import { DatasetLinkPipe } from "@common/pipes/dataset-link.pipe";
import { MetadataBlockLinkPipe } from "@common/pipes/metadata-block-link.pipe";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";

import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import {
    CommitStepMode,
    MetadataCommitData,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-commit-navigator",
    templateUrl: "./commit-navigator.component.html",
    styleUrls: ["./commit-navigator.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        DatePipe,
        RouterLink,
        SlicePipe,
        //-----//
        MatIconModule,
        MatTooltipModule,
        //-----//
        DatasetLinkPipe,
        MetadataBlockLinkPipe,
    ],
})
export class CommitNavigatorComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public commitData: MetadataCommitData;
    @Input({ required: true }) public section: MetadataTabs;

    public readonly CommitStepMode: typeof CommitStepMode = CommitStepMode;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;

    private navigationService = inject(NavigationService);

    public onStepModeChange(event: Event): void {
        const steps =
            event.target instanceof HTMLSelectElement ? enumValueOf(CommitStepMode, event.target.value) : undefined;
        if (!steps) {
            return;
        }
        const snapshot = this.commitData.snapshot;
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: DatasetViewTypeEnum.Metadata,
            section: this.section,
            head: snapshot.isLatest ? undefined : snapshot.block.blockHash,
            steps,
        });
    }
}
