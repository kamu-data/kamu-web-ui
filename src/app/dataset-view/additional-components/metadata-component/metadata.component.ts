/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgClass, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterOutlet } from "@angular/router";

import { DatasetMetadataSummaryFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { momentConvertDateToLocalWithFormat } from "src/app/common/helpers/app.helpers";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MaybeNull, MaybeNullOrUndefined, MaybeUndefined } from "src/app/interface/app.types";
import { DatasetSchema } from "src/app/interface/dataset-schema.interface";
import ProjectLinks from "src/app/project-links";

import {
    AddPushSourceEventFragment,
    DatasetKind,
    DatasetTransformFragment,
    SetPollingSourceEventFragment,
} from "../../../api/kamu.graphql.interface";
import { FeatureFlagDirective } from "../../../common/directives/feature-flag.directive";
import AppValues from "../../../common/values/app.values";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "../../dataset-view.interface";
import { MetadataSchemaUpdate } from "../../dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { CommitNavigatorComponent } from "./components/commit-navigator/commit-navigator.component";
import { METADATA_TAB_MENU_ITEMS, MetadataMenuItem, MetadataTabs } from "./metadata.constants";

@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
    styleUrls: ["./metadata.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        NgFor,
        RouterLink,
        RouterOutlet,
        NgClass,
        //-----//
        MatIconModule,
        //-----//
        CommitNavigatorComponent,
        FeatureFlagDirective,
    ],
})
export class MetadataComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_VIEW_METADATA_KEY) public datasetMetadataTabData: DatasetOverviewTabData;
    @Input(RoutingResolvers.DATASET_METADATA_ACTIVE_TAB_KEY) public activeTab: MetadataTabs;
    @Output() public pageChangeEmit = new EventEmitter<number>();

    public readonly METADATA_MENU_DESCRIPTORS: MetadataMenuItem[] = METADATA_TAB_MENU_ITEMS;
    public readonly MetadataTabs: typeof MetadataTabs = MetadataTabs;

    public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        metadataSummary: DatasetMetadataSummaryFragment;
        pageInfo: PageBasedInfo;
    };

    public readonly URL_PARAM_SET_TRANSFORM = ProjectLinks.URL_PARAM_SET_TRANSFORM;
    public readonly URL_PARAM_ADD_POLLING_SOURCE = ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE;
    public readonly URL_PARAM_ADD_PUSH_SOURCE = ProjectLinks.URL_PARAM_ADD_PUSH_SOURCE;

    private datasetSubsService = inject(DatasetSubscriptionsService);

    public ngOnInit() {
        this.datasetSubsService.metadataSchemaChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((schemaUpdate: MetadataSchemaUpdate) => {
                this.currentState = {
                    schema: schemaUpdate.schema,
                    metadataSummary: schemaUpdate.metadataSummary,
                    pageInfo: schemaUpdate.pageInfo,
                };
            });
    }

    public getRouteLink(tab: MetadataTabs): string {
        return `/${this.datasetMetadataTabData.datasetBasics.owner.accountName}/${this.datasetMetadataTabData.datasetBasics.name}/${DatasetViewTypeEnum.Metadata}/${tab}`;
    }

    public getVisibilityMenuItem(tab: MetadataTabs): boolean {
        switch (tab) {
            case MetadataTabs.PollingSource:
                return Boolean(this.currentPollingSource);
            case MetadataTabs.PushSources:
                return Boolean(this.currentPushSources?.length);
            case MetadataTabs.Transformation:
                return Boolean(this.currentTransform);
            case MetadataTabs.Watermark:
                return this.isRoot;
            default:
                return true;
        }
    }

    public onPageChange(currentPage: number): void {
        this.pageChangeEmit.emit(currentPage);
    }

    public get currentPage(): number {
        return this.currentState ? this.currentState.pageInfo.currentPage + 1 : 1;
    }

    public get isRoot(): boolean {
        return this.datasetMetadataTabData.datasetBasics.kind === DatasetKind.Root;
    }

    public get totalPages(): number {
        return this.currentState?.pageInfo.totalPages ?? 1;
    }

    public get latestBlockHash(): string {
        return this.currentState ? this.currentState.metadataSummary.metadata.chain.blocks.nodes[0].blockHash : "";
    }

    public get currentPollingSource(): MaybeNullOrUndefined<SetPollingSourceEventFragment> {
        return this.currentState?.metadataSummary.metadata.currentPollingSource;
    }

    public get currentPushSources(): MaybeNullOrUndefined<AddPushSourceEventFragment[]> {
        return this.currentState?.metadataSummary.metadata.currentPushSources;
    }

    public get currentTransform(): MaybeNullOrUndefined<DatasetTransformFragment> {
        return this.currentState?.metadataSummary.metadata.currentTransform;
    }

    public get latestBlockSystemTime(): string {
        const systemTimeAsString: MaybeUndefined<string> =
            this.currentState?.metadataSummary.metadata.chain.blocks.nodes[0].systemTime;
        return systemTimeAsString
            ? momentConvertDateToLocalWithFormat({
                  date: new Date(String(systemTimeAsString)),
                  format: AppValues.DISPLAY_DATE_FORMAT,
                  isTextDate: true,
              })
            : "";
    }

    public hasAnySource(): boolean {
        return !this.currentPollingSource && !this.currentPushSources?.length;
    }
}
