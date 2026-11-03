/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterOutlet } from "@angular/router";

import { DatasetLinkPipe } from "@common/pipes/dataset-link.pipe";
import { SourceEventEditorLinkPipe } from "@common/pipes/source-event-editor-link.pipe";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { DatasetKind } from "@api/kamu.graphql.interface";

import { CommitNavigatorComponent } from "src/app/dataset-view/additional-components/metadata-component/components/commit-navigator/commit-navigator.component";
import {
    METADATA_TAB_MENU_ITEMS,
    MetadataMenuItem,
    MetadataTabs,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import {
    MetadataCommitData,
    MetadataSnapshot,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { SourceEventEditor } from "src/app/project-links";

@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
    styleUrls: ["./metadata.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        RouterLink,
        RouterOutlet,
        NgClass,
        //-----//
        MatIconModule,
        //-----//
        CommitNavigatorComponent,
        SourceEventEditorLinkPipe,
        DatasetLinkPipe,
    ],
})
export class MetadataComponent {
    @Input(RoutingResolvers.DATASET_VIEW_METADATA_KEY) public datasetMetadataTabData: DatasetOverviewTabData;
    @Input(RoutingResolvers.DATASET_METADATA_ACTIVE_TAB_KEY) public activeTab: MetadataTabs;
    @Input(RoutingResolvers.DATASET_METADATA_COMMIT_KEY) public commitData: MetadataCommitData;

    public readonly METADATA_MENU_DESCRIPTORS: MetadataMenuItem[] = METADATA_TAB_MENU_ITEMS;
    public readonly MetadataTabs: typeof MetadataTabs = MetadataTabs;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly SourceEventEditor: typeof SourceEventEditor = SourceEventEditor;

    public get snapshot(): MetadataSnapshot {
        return this.commitData.snapshot;
    }

    public getVisibilityMenuItem(tab: MetadataTabs): boolean {
        switch (tab) {
            case MetadataTabs.PollingSource:
                return Boolean(this.snapshot.pollingSource);
            case MetadataTabs.PushSources:
                return Boolean(this.snapshot.pushSources.length);
            case MetadataTabs.Transformation:
                return Boolean(this.snapshot.transform);
            case MetadataTabs.Watermark:
                return this.isRoot;
            default:
                return true;
        }
    }

    public get isRoot(): boolean {
        return this.datasetMetadataTabData.datasetBasics.kind === DatasetKind.Root;
    }

    public get hasNoMetadata(): boolean {
        return this.isRoot
            ? !this.snapshot.pollingSource && !this.snapshot.pushSources.length
            : !this.snapshot.transform;
    }
}
