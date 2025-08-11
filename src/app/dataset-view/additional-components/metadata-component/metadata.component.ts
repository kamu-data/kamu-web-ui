/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    AddPushSourceEventFragment,
    DatasetKind,
    DatasetTransformFragment,
    LicenseFragment,
    SetPollingSourceEventFragment,
} from "../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from "@angular/core";
import { DatasetSchema } from "../../../interface/dataset.interface";
import AppValues from "../../../common/values/app.values";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { MetadataSchemaUpdate } from "../../dataset.subscriptions.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetMetadataSummaryFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { isNil, momentConvertDateToLocalWithFormat, promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { MaybeNull, MaybeNullOrUndefined, MaybeUndefined } from "src/app/interface/app.types";
import { NavigationService } from "src/app/services/navigation.service";
import { ModalService } from "src/app/common/components/modal/modal.service";
import ProjectLinks from "src/app/project-links";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetOverviewTabData } from "../../dataset-view.interface";
import { CardsPropertyComponent } from "../../../dataset-block/metadata-block/components/event-details/components/common/cards-property/cards-property.component";
import { MergeStrategyPropertyComponent } from "../../../dataset-block/metadata-block/components/event-details/components/common/merge-strategy-property/merge-strategy-property.component";
import { SchemaPropertyComponent } from "../../../dataset-block/metadata-block/components/event-details/components/common/schema-property/schema-property.component";
import { RouterLink } from "@angular/router";
import { SqlQueryViewerComponent } from "../../../dataset-block/metadata-block/components/event-details/components/common/sql-query-viewer/sql-query-viewer.component";
import { EnginePropertyComponent } from "../../../dataset-block/metadata-block/components/event-details/components/common/engine-property/engine-property.component";
import { OwnerPropertyComponent } from "../../../dataset-block/metadata-block/components/event-details/components/common/owner-property/owner-property.component";
import { DatasetNamePropertyComponent } from "../../../dataset-block/metadata-block/components/event-details/components/common/dataset-name-property/dataset-name-property.component";
import { DisplayTimeComponent } from "../../../common/components/display-time/display-time.component";
import { YamlEventViewerComponent } from "../../../common/components/yaml-event-viewer/yaml-event-viewer.component";
import { LinkPropertyComponent } from "../../../dataset-block/metadata-block/components/event-details/components/common/link-property/link-property.component";
import { DynamicTableComponent } from "../../../common/components/dynamic-table/dynamic-table.component";
import { BlockRowDataComponent } from "../../../common/components/block-row-data/block-row-data.component";
import { MatIconModule } from "@angular/material/icon";
import { CommitNavigatorComponent } from "./components/commit-navigator/commit-navigator.component";
import { FeatureFlagDirective } from "../../../common/directives/feature-flag.directive";
import { NgIf, NgFor, NgTemplateOutlet, TitleCasePipe, NgClass } from "@angular/common";
import { MetadataTabs } from "./metadata.types";

@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
    styleUrls: ["./metadata.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgIf,
        NgFor,
        NgTemplateOutlet,
        RouterLink,
        TitleCasePipe,
        NgClass,

        //-----//
        MatIconModule,

        //-----//
        CommitNavigatorComponent,
        FeatureFlagDirective,
        BlockRowDataComponent,
        DynamicTableComponent,
        LinkPropertyComponent,
        YamlEventViewerComponent,
        DisplayTimeComponent,
        DatasetNamePropertyComponent,
        OwnerPropertyComponent,
        EnginePropertyComponent,
        SqlQueryViewerComponent,
        SchemaPropertyComponent,
        MergeStrategyPropertyComponent,
        CardsPropertyComponent,
    ],
})
export class MetadataComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_VIEW_METADATA_KEY) public datasetMetadataTabData: DatasetOverviewTabData;
    @Output() public pageChangeEmit = new EventEmitter<number>();

    public activeTab: MetadataTabs = MetadataTabs.SCHEMA;
    public readonly MetadataTabs: typeof MetadataTabs = MetadataTabs;

    public readonly ReadSectionMapping: Record<string, string> = {
        ReadStepCsv: "Csv",
        ReadStepGeoJson: "Geo json",
        ReadStepEsriShapefile: "Esri shapefile",
        ReadStepParquet: "Parquet",
        ReadStepJson: "Json",
        ReadStepNdJson: "Newline-delimited json",
        ReadStepNdGeoJson: "Newline-delimited geo json",
    };

    public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        metadataSummary: DatasetMetadataSummaryFragment;
        pageInfo: PageBasedInfo;
    };

    public readonly URL_PARAM_SET_TRANSFORM = ProjectLinks.URL_PARAM_SET_TRANSFORM;

    private datasetSubsService = inject(DatasetSubscriptionsService);
    private navigationService = inject(NavigationService);
    private modalService = inject(ModalService);

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

    public onPageChange(currentPage: number): void {
        this.pageChangeEmit.emit(currentPage);
    }

    public get currentPage(): number {
        return this.currentState ? this.currentState.pageInfo.currentPage + 1 : 1;
    }

    public get totalPages(): number {
        return this.currentState?.pageInfo.totalPages ?? 1;
    }

    public get latestBlockHash(): string {
        return this.currentState ? this.currentState.metadataSummary.metadata.chain.blocks.nodes[0].blockHash : "";
    }

    public get currentLicense(): MaybeNullOrUndefined<LicenseFragment> {
        return this.currentState?.metadataSummary.metadata.currentLicense;
    }

    public get currentWatermark(): MaybeNullOrUndefined<string> {
        return this.currentState?.metadataSummary.metadata.currentWatermark;
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

    public get canEditSetPollingSource(): boolean {
        if (this.currentState) {
            return (
                this.datasetMetadataTabData.datasetBasics.kind === DatasetKind.Root &&
                !isNil(this.currentState.metadataSummary.metadata.currentPollingSource) &&
                this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit
            );
        } else {
            return false;
        }
    }

    public get canEditAddPushSource(): boolean {
        if (this.currentState) {
            return (
                this.datasetMetadataTabData.datasetBasics.kind === DatasetKind.Root &&
                this.currentState.metadataSummary.metadata.currentPushSources.length > 0 &&
                this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit
            );
        } else {
            return false;
        }
    }

    public get canEditSetTransform(): boolean {
        if (this.currentState) {
            return (
                this.datasetMetadataTabData.datasetBasics.kind === DatasetKind.Derivative &&
                !isNil(this.currentState.metadataSummary.metadata.currentTransform) &&
                this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit
            );
        } else {
            return false;
        }
    }

    public setActiveTab(activeTab: MetadataTabs): void {
        this.activeTab = activeTab;
    }

    public navigateToEditPollingSource(): void {
        this.navigationService.navigateToAddPollingSource({
            accountName: this.datasetMetadataTabData.datasetBasics.owner.accountName,
            datasetName: this.datasetMetadataTabData.datasetBasics.name,
        });
    }

    public navigateToEditAddPushSource(sourceName: string): void {
        this.navigationService.navigateToAddPushSource(
            {
                accountName: this.datasetMetadataTabData.datasetBasics.owner.accountName,
                datasetName: this.datasetMetadataTabData.datasetBasics.name,
            },
            sourceName,
        );
    }

    public navigateToAddPushSource(): void {
        this.navigationService.navigateToAddPushSource({
            accountName: this.datasetMetadataTabData.datasetBasics.owner.accountName,
            datasetName: this.datasetMetadataTabData.datasetBasics.name,
        });
    }

    public navigateToEditSetTransform(): void {
        this.navigationService.navigateToSetTransform({
            accountName: this.datasetMetadataTabData.datasetBasics.owner.accountName,
            datasetName: this.datasetMetadataTabData.datasetBasics.name,
        });
    }

    public onDeletePollingSource(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
        //TODO:
        // this.trackSubscription(
        //     this.datasetCommitService
        //         .commitEventToDataset(
        //             this.getDatasetInfoFromUrl().accountName,
        //             this.getDatasetInfoFromUrl().datasetName,
        //             this.yamlEventService.buildYamlDisablePollingSourceEvent(),
        //         )
        //         .subscribe(),
        // );
    }

    public onDeletePushSource(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }

    public hasAnySource(): boolean {
        return !this.currentPollingSource && !this.currentPushSources?.length;
    }
}
